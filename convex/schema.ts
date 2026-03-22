import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  items: defineTable({
    name: v.string(),
    category: v.optional(v.string()),
    crystalValue: v.number(),
    isActive: v.boolean(),
  })
    .index('by_active', ['isActive'])
    .searchIndex('search_name', { searchField: 'name' }),

  packs: defineTable({
    name: v.string(),
    price: v.number(),
    items: v.array(
      v.object({
        itemId: v.id('items'),
        quantity: v.number(), // effective quantity (EV when tiers present)
        tiers: v.optional(
          v.array(v.object({ probability: v.number(), quantity: v.number() }))
        ),
      })
    ),
    crystalEquivalent: v.number(),
    priceCurrency: v.optional(v.union(v.literal('usd'), v.literal('crystals'))),
    published: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index('by_published', ['published'])
    .searchIndex('search_name', { searchField: 'name' }),
})
