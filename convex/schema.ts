import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// ─── Income profile validators ───────────────────────────────────────────────

const standardABTier = v.union(
  v.literal('none'),
  v.literal('I'),
  v.literal('II'),
  v.literal('Bonus'),
  v.literal('Mythic'),
  v.literal('CTI'),
  v.literal('CTII'),
  v.literal('CTIII')
)

const shortABTier = v.union(
  v.literal('none'),
  v.literal('I'),
  v.literal('II'),
  v.literal('III'),
  v.literal('IV'),
  v.literal('V'),
  v.literal('VI')
)

// v.record() is used instead of v.object() because battle names contain
// spaces, which Convex rejects as object field identifiers.
const assaultBattlesValidator = v.record(v.string(), v.union(standardABTier, shortABTier))

// Placeholder sections: constrained to string keys -> string | number values.
// Replace with strict validators when each section is implemented.
const placeholderSectionValidator = v.record(v.string(), v.union(v.string(), v.number()))

export default defineSchema({
  // Rate limiter state table (inlined from convex-helpers/server/rateLimit)
  rateLimits: defineTable({
    name: v.string(),
    key: v.optional(v.string()),
    value: v.number(),
    ts: v.number(),
  }).index('name', ['name', 'key']),

  incomeProfiles: defineTable({
    userId: v.string(),
    updatedAt: v.number(),
    crystalIncome: v.optional(placeholderSectionValidator),
    assaultBattles: v.optional(assaultBattlesValidator),
    territoryBattles: v.optional(placeholderSectionValidator),
    raidRewards: v.optional(placeholderSectionValidator),
    territoryWar: v.optional(placeholderSectionValidator),
    conquest: v.optional(placeholderSectionValidator),
    specialEvents: v.optional(placeholderSectionValidator),
  }).index('by_userId', ['userId']),

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
    packType: v.optional(v.union(v.literal('standard'), v.literal('sab'))),
    price: v.number(),
    items: v.array(
      v.object({
        itemId: v.id('items'),
        quantity: v.number(), // effective quantity (EV when tiers present)
        tiers: v.optional(v.array(v.object({ probability: v.number(), quantity: v.number() }))),
      })
    ),
    crystalEquivalent: v.number(),
    priceCurrency: v.optional(v.union(v.literal('usd'), v.literal('crystals'))),
    published: v.boolean(),
    notes: v.optional(v.string()),
    // SAB-specific fields
    sabTiers: v.optional(
      v.array(
        v.object({
          price: v.number(),
          crystalEquivalent: v.number(),
          items: v.array(
            v.object({
              itemId: v.id('items'),
              quantity: v.number(),
            })
          ),
        })
      )
    ),
    sabDiscounts: v.optional(
      v.array(
        v.object({
          quantity: v.number(),
          discountAmount: v.number(),
        })
      )
    ),
  })
    .index('by_published', ['published'])
    .searchIndex('search_name', { searchField: 'name' }),
})
