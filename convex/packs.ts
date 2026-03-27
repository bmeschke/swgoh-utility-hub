import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/adminCheck'
import { rateLimit } from './lib/rateLimits'

const tierValidator = v.object({ probability: v.number(), quantity: v.number() })

const itemLineValidator = v.object({
  itemId: v.id('items'),
  quantity: v.number(),
  tiers: v.optional(v.array(tierValidator)),
})

/** Public: list all published packs */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('packs')
      .withIndex('by_published', (q) => q.eq('published', true))
      .take(200)
  },
})

/** Admin: list all packs including unpublished */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.db.query('packs').take(500)
  },
})

/** Public: get a single pack with full item details joined */
export const get = query({
  args: { id: v.id('packs') },
  handler: async (ctx, args) => {
    const pack = await ctx.db.get(args.id)
    if (!pack) return null

    const itemsWithDetails = await Promise.all(
      pack.items.map(async (line) => {
        const item = await ctx.db.get(line.itemId)
        return {
          itemId: line.itemId,
          quantity: line.quantity,
          tiers: line.tiers,
          name: item?.name ?? 'Unknown',
          category: item?.category,
          crystalValue: item?.crystalValue ?? 0,
        }
      })
    )

    return { ...pack, itemsWithDetails }
  },
})

/** Admin: create a pack, computing crystalEquivalent server-side */
export const create = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    priceCurrency: v.optional(v.union(v.literal('usd'), v.literal('crystals'))),
    items: v.array(itemLineValidator),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity.subject, throws: true })

    let crystalEquivalent = 0
    for (const line of args.items) {
      const item = await ctx.db.get(line.itemId)
      if (!item) throw new ConvexError(`Item not found: ${line.itemId}`)
      crystalEquivalent += item.crystalValue * line.quantity
    }

    return await ctx.db.insert('packs', {
      name: args.name,
      price: args.price,
      priceCurrency: args.priceCurrency ?? 'usd',
      items: args.items,
      crystalEquivalent,
      published: true,
      notes: args.notes,
    })
  },
})

/** Admin: partial update on a pack, recomputing crystalEquivalent if items change */
export const update = mutation({
  args: {
    id: v.id('packs'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    priceCurrency: v.optional(v.union(v.literal('usd'), v.literal('crystals'))),
    items: v.optional(v.array(itemLineValidator)),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity.subject, throws: true })
    const { id, items, ...rest } = args
    const updates: Record<string, unknown> = { ...rest }

    if (items !== undefined) {
      let crystalEquivalent = 0
      for (const line of items) {
        const item = await ctx.db.get(line.itemId)
        if (!item) throw new ConvexError(`Item not found: ${line.itemId}`)
        crystalEquivalent += item.crystalValue * line.quantity
      }
      updates.items = items
      updates.crystalEquivalent = crystalEquivalent
    }

    await ctx.db.patch(id, updates)
  },
})

/** Admin: toggle published flag */
export const togglePublished = mutation({
  args: { id: v.id('packs') },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity.subject, throws: true })
    const pack = await ctx.db.get(args.id)
    if (!pack) throw new ConvexError('Pack not found')
    await ctx.db.patch(args.id, { published: !pack.published })
  },
})

/** Admin: delete a pack */
export const deletePack = mutation({
  args: { id: v.id('packs') },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity.subject, throws: true })
    const pack = await ctx.db.get(args.id)
    if (!pack) throw new ConvexError('Pack not found')
    await ctx.db.delete(args.id)
  },
})
