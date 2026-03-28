import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { MutationCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { requireAdmin } from './lib/adminCheck'
import { rateLimit } from './lib/rateLimits'

const tierValidator = v.object({ probability: v.number(), quantity: v.number() })

const itemLineValidator = v.object({
  itemId: v.id('items'),
  quantity: v.number(),
  tiers: v.optional(v.array(tierValidator)),
})

const sabTierInputValidator = v.object({
  price: v.number(),
  items: v.array(v.object({ itemId: v.id('items'), quantity: v.number() })),
})

const sabDiscountValidator = v.object({
  quantity: v.number(),
  discountAmount: v.number(),
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

    // Standard pack: join item details
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

    // SAB pack: join item details for each tier
    let sabTiersWithDetails: typeof pack.sabTiers | undefined = undefined
    if (pack.sabTiers) {
      sabTiersWithDetails = await Promise.all(
        pack.sabTiers.map(async (tier) => ({
          ...tier,
          items: await Promise.all(
            tier.items.map(async (line) => {
              const item = await ctx.db.get(line.itemId)
              return {
                itemId: line.itemId,
                quantity: line.quantity,
                name: item?.name ?? 'Unknown',
                category: item?.category,
                crystalValue: item?.crystalValue ?? 0,
              }
            })
          ),
        }))
      )
    }

    return { ...pack, itemsWithDetails, sabTiersWithDetails }
  },
})

// ─── SAB helpers ──────────────────────────────────────────────────────────────

type SabTierInput = {
  price: number
  items: Array<{ itemId: string; quantity: number }>
}

async function computeSabFields(ctx: MutationCtx, sabTiers: SabTierInput[]) {
  let totalCE = 0

  const enrichedTiers = await Promise.all(
    sabTiers.map(async (tier) => {
      let tierTotal = 0
      for (const line of tier.items) {
        const item = await ctx.db.get(line.itemId as never)
        if (!item) throw new ConvexError(`Item not found: ${line.itemId}`)
        tierTotal += (item as { crystalValue: number }).crystalValue * line.quantity
      }
      // Average CE across choices (user picks one item per tier)
      const tierCE = tier.items.length > 0 ? tierTotal / tier.items.length : 0
      totalCE += tierCE
      return {
        price: tier.price,
        crystalEquivalent: tierCE,
        items: tier.items.map((line) => ({
          itemId: line.itemId as Id<'items'>,
          quantity: line.quantity,
        })),
      }
    })
  )

  return { enrichedTiers, avgCE: totalCE }
}

/** Admin: create a pack, computing crystalEquivalent server-side */
export const create = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    priceCurrency: v.optional(v.union(v.literal('usd'), v.literal('crystals'))),
    items: v.array(itemLineValidator),
    notes: v.optional(v.string()),
    packType: v.optional(v.union(v.literal('standard'), v.literal('sab'))),
    sabTiers: v.optional(v.array(sabTierInputValidator)),
    sabDiscounts: v.optional(v.array(sabDiscountValidator)),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity?.subject ?? 'dev', throws: true })

    if (args.packType === 'sab' && args.sabTiers) {
      const { enrichedTiers, avgCE } = await computeSabFields(ctx, args.sabTiers)
      return await ctx.db.insert('packs', {
        name: args.name,
        packType: 'sab',
        price: enrichedTiers[0]?.price ?? 0, // tier 1 price for "From $X" display
        priceCurrency: 'usd',
        items: [],
        crystalEquivalent: Math.round(avgCE),
        published: true,
        notes: args.notes,
        sabTiers: enrichedTiers,
        sabDiscounts: args.sabDiscounts,
      })
    }

    // Standard pack
    let crystalEquivalent = 0
    for (const line of args.items) {
      const item = await ctx.db.get(line.itemId)
      if (!item) throw new ConvexError(`Item not found: ${line.itemId}`)
      crystalEquivalent += item.crystalValue * line.quantity
    }

    return await ctx.db.insert('packs', {
      name: args.name,
      packType: 'standard',
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
    packType: v.optional(v.union(v.literal('standard'), v.literal('sab'))),
    sabTiers: v.optional(v.array(sabTierInputValidator)),
    sabDiscounts: v.optional(v.array(sabDiscountValidator)),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    await rateLimit(ctx, { name: 'adminMutation', key: identity?.subject ?? 'dev', throws: true })
    const { id, items, sabTiers, ...rest } = args
    const updates: Record<string, unknown> = { ...rest }

    if (args.packType === 'sab' && sabTiers !== undefined) {
      const { enrichedTiers, avgCE } = await computeSabFields(ctx, sabTiers)
      updates.sabTiers = enrichedTiers
      updates.crystalEquivalent = Math.round(avgCE)
      updates.price = enrichedTiers[0]?.price ?? 0
      updates.items = []
    } else if (items !== undefined) {
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
    await rateLimit(ctx, { name: 'adminMutation', key: identity?.subject ?? 'dev', throws: true })
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
    await rateLimit(ctx, { name: 'adminMutation', key: identity?.subject ?? 'dev', throws: true })
    const pack = await ctx.db.get(args.id)
    if (!pack) throw new ConvexError('Pack not found')
    await ctx.db.delete(args.id)
  },
})
