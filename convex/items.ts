import { ConvexError, v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { requireAdmin } from './lib/adminCheck'
import { SEED_ITEMS } from './seeds/itemSeedData'

/** Public: returns all active items (for evaluation typeahead) */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('items')
      .withIndex('by_active', (q) => q.eq('isActive', true))
      .take(500)
  },
})

/** Admin: returns all items including inactive. Returns null if not authenticated. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    const adminId = process.env.ADMIN_USER_ID
    if (!adminId || identity.subject !== adminId) return null
    return await ctx.db.query('items').take(500)
  },
})

/** Admin: create a new item */
export const create = mutation({
  args: {
    name: v.string(),
    category: v.optional(v.string()),
    crystalValue: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db.insert('items', {
      name: args.name,
      category: args.category,
      crystalValue: args.crystalValue,
      isActive: true,
    })
  },
})

/** Admin: update an item */
export const update = mutation({
  args: {
    id: v.id('items'),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    crystalValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...fields } = args
    const updates: Record<string, unknown> = {}
    if (fields.name !== undefined) updates.name = fields.name
    if (fields.category !== undefined) updates.category = fields.category
    if (fields.crystalValue !== undefined) updates.crystalValue = fields.crystalValue
    await ctx.db.patch(id, updates)
  },
})

/** Admin: toggle isActive on an item */
export const toggleActive = mutation({
  args: { id: v.id('items') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const item = await ctx.db.get(args.id)
    if (!item) throw new ConvexError('Item not found')
    await ctx.db.patch(args.id, { isActive: !item.isActive })
  },
})

/** Internal: bulk-insert seed items, skipping duplicates by name */
export const seedItems = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const seed of SEED_ITEMS) {
      const existing = await ctx.db
        .query('items')
        .withSearchIndex('search_name', (q) => q.search('name', seed.name))
        .take(5)
      const duplicate = existing.find(
        (i) => i.name.toLowerCase() === seed.name.toLowerCase()
      )
      if (!duplicate) {
        await ctx.db.insert('items', {
          name: seed.name,
          category: seed.category,
          crystalValue: seed.crystalValue,
          isActive: true,
        })
      }
    }
  },
})

/** Internal-only seed — no auth check, callable from dashboard or other Convex functions */
export const internalSeed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('items').take(1)
    if (existing.length > 0) {
      throw new ConvexError('Items already seeded')
    }
    for (const seed of SEED_ITEMS) {
      await ctx.db.insert('items', {
        name: seed.name,
        category: seed.category,
        crystalValue: seed.crystalValue,
        isActive: true,
      })
    }
  },
})

/** Admin: trigger the seed (calls internal seedItems) */
export const triggerSeed = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    // Check if items already exist
    const existing = await ctx.db.query('items').take(1)
    if (existing.length > 0) {
      throw new ConvexError('Items already seeded')
    }
    // Run seed directly since we're in the same runtime
    for (const seed of SEED_ITEMS) {
      await ctx.db.insert('items', {
        name: seed.name,
        category: seed.category,
        crystalValue: seed.crystalValue,
        isActive: true,
      })
    }
  },
})
