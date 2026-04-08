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

const gacLeagueValidator = v.union(
  v.literal('Carbonite'),
  v.literal('Bronzium'),
  v.literal('Chromium'),
  v.literal('Aurodium'),
  v.literal('Kyber')
)

const gacDivisionValidator = v.union(
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5)
)

const grandArenaValidator = v.object({
  league: gacLeagueValidator,
  division: gacDivisionValidator,
})

const fleetArenaRankValidator = v.union(
  v.literal('1'),
  v.literal('2'),
  v.literal('3'),
  v.literal('4'),
  v.literal('5'),
  v.literal('6-10'),
  v.literal('11-20'),
  v.literal('21-50'),
  v.literal('51-100'),
  v.literal('101-200'),
  v.literal('201-500'),
  v.literal('501+')
)

const fleetArenaValidator = v.object({
  rank: fleetArenaRankValidator,
})

const twGuildBracketValidator = v.union(
  v.literal('<10M'),
  v.literal('10-50M'),
  v.literal('50-100M'),
  v.literal('100-200M'),
  v.literal('200-300M'),
  v.literal('300-380M'),
  v.literal('380M+')
)

const territoryWarValidator = v.object({
  guildGP: twGuildBracketValidator,
})

const raidKeyValidator = v.union(
  v.literal('order66'),
  v.literal('naboo'),
  v.literal('speederBike'),
  v.literal('krayt'),
  v.literal('strNormal'),
  v.literal('strHeroic'),
  v.literal('haatNormal'),
  v.literal('haatHeroic'),
  v.literal('pitTierI'),
  v.literal('pitTierII'),
  v.literal('pitTierIII'),
  v.literal('pitTierIV'),
  v.literal('pitTierV'),
  v.literal('pitTierVI'),
  v.literal('pitHeroic')
)

const raidRewardsValidator = v.object({
  raidKey: raidKeyValidator,
  guildChestIdx: v.number(),
  personalMilestoneIdx: v.union(v.number(), v.null()),
})

const tbTypeValidator = v.union(
  v.literal('lsHoth'),
  v.literal('dsHoth'),
  v.literal('lsGeo'),
  v.literal('dsGeo'),
  v.literal('rote')
)

const tbSelectionValidator = v.object({
  tb: tbTypeValidator,
  stars: v.number(),
  specialMissions: v.optional(v.number()),
  bonusPlanets: v.optional(v.number()),
})

const territoryBattlesValidator = v.object({
  tb1: tbSelectionValidator,
  tb2: tbSelectionValidator,
})

const conquestValidator = v.object({
  mode: v.union(v.literal('Easy'), v.literal('Normal'), v.literal('Hard')),
  crateTier: v.number(),
})

const specialEventsValidator = v.object({
  smugglersRun1: v.union(v.literal('none'), v.literal('Tough'), v.literal('Deadly')),
  smugglersRun2: v.union(v.literal('none'), v.literal('Very Deadly')),
  smugglersRun3: v.union(
    v.literal('none'),
    v.literal('Very Deadly'),
    v.literal('Extremely Deadly')
  ),
  covenOfShadows: v.union(v.literal('none'), v.literal('Tier II'), v.literal('Tier III')),
})

const passesValidator = v.object({
  episodePass: v.boolean(),
  conquestPass: v.boolean(),
})

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
    assaultBattles: v.optional(assaultBattlesValidator),
    grandArena: v.optional(grandArenaValidator),
    fleetArena: v.optional(fleetArenaValidator),
    territoryWar: v.optional(territoryWarValidator),
    raidRewards: v.optional(raidRewardsValidator),
    territoryBattles: v.optional(territoryBattlesValidator),
    conquest: v.optional(conquestValidator),
    specialEvents: v.optional(specialEventsValidator),
    passes: v.optional(passesValidator),
  }).index('by_userId', ['userId']),

  items: defineTable({
    name: v.string(),
    category: v.optional(v.string()),
    crystalValue: v.number(),
    source: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index('by_active', ['isActive'])
    .searchIndex('search_name', { searchField: 'name' }),

  packs: defineTable({
    name: v.string(),
    packType: v.optional(v.union(v.literal('standard'), v.literal('sab'), v.literal('ascension'))),
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
    // Ascension-specific fields
    ascensionTiers: v.optional(
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
  })
    .index('by_published', ['published'])
    .searchIndex('search_name', { searchField: 'name' }),
})
