import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { rateLimit } from './lib/rateLimits'

// ─── Validators (must match schema.ts) ───────────────────────────────────────

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

const grandArenaValidator = v.object({
  league: v.union(
    v.literal('Carbonite'),
    v.literal('Bronzium'),
    v.literal('Chromium'),
    v.literal('Aurodium'),
    v.literal('Kyber')
  ),
  division: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
})

const fleetArenaValidator = v.object({
  rank: v.union(
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
  ),
})

const territoryWarValidator = v.object({
  guildGP: v.union(
    v.literal('<10M'),
    v.literal('10-50M'),
    v.literal('50-100M'),
    v.literal('100-200M'),
    v.literal('200-300M'),
    v.literal('300-380M'),
    v.literal('380M+')
  ),
})

const raidRewardsValidator = v.object({
  raidKey: v.union(
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
  ),
  guildChestIdx: v.number(),
  personalMilestoneIdx: v.union(v.number(), v.null()),
})

const tbSelectionValidator = v.object({
  tb: v.union(
    v.literal('lsHoth'),
    v.literal('dsHoth'),
    v.literal('lsGeo'),
    v.literal('dsGeo'),
    v.literal('rote')
  ),
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
  smugglersRun1: v.string(),
  smugglersRun2: v.string(),
  smugglersRun3: v.string(),
  covenOfShadows: v.string(),
})

const passesValidator = v.object({
  episodePass: v.boolean(),
  conquestPass: v.boolean(),
})

// ─── Allowed field names for income profiles ─────────────────────────────────

const INCOME_FIELDS = [
  'assaultBattles',
  'grandArena',
  'fleetArena',
  'territoryWar',
  'raidRewards',
  'territoryBattles',
  'conquest',
  'specialEvents',
  'passes',
] as const

// ─── Queries & Mutations ─────────────────────────────────────────────────────

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    return await ctx.db
      .query('incomeProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', identity.tokenIdentifier))
      .unique()
  },
})

export const upsert = mutation({
  args: {
    assaultBattles: v.optional(assaultBattlesValidator),
    grandArena: v.optional(grandArenaValidator),
    fleetArena: v.optional(fleetArenaValidator),
    territoryWar: v.optional(territoryWarValidator),
    raidRewards: v.optional(raidRewardsValidator),
    territoryBattles: v.optional(territoryBattlesValidator),
    conquest: v.optional(conquestValidator),
    specialEvents: v.optional(specialEventsValidator),
    passes: v.optional(passesValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Not authenticated')

    await rateLimit(ctx, {
      name: 'incomeUpsert',
      key: identity.tokenIdentifier,
      throws: true,
    })

    const existing = await ctx.db
      .query('incomeProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', identity.tokenIdentifier))
      .unique()

    // Explicitly pick only allowed fields — never spread raw args
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const field of INCOME_FIELDS) {
      if (args[field] !== undefined) {
        patch[field] = args[field]
      }
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
    } else {
      await ctx.db.insert('incomeProfiles', {
        userId: identity.tokenIdentifier,
        ...patch,
      } as typeof patch & { userId: string; updatedAt: number })
    }
  },
})
