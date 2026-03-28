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

const assaultBattlesValidator = v.object({
  'Fanatical Devotion': v.optional(standardABTier),
  'Forest Moon': v.optional(standardABTier),
  'Ground War': v.optional(standardABTier),
  'Military Might': v.optional(standardABTier),
  'Places of Power': v.optional(standardABTier),
  'Rebel Roundup': v.optional(standardABTier),
  'Secrets and Shadows': v.optional(standardABTier),
  'Peridea Patrol': v.optional(shortABTier),
  'Duel of the Fates': v.optional(shortABTier),
})

const placeholderSectionValidator = v.record(v.string(), v.union(v.string(), v.number()))

// ─── Allowed field names for income profiles ─────────────────────────────────

const INCOME_FIELDS = [
  'crystalIncome',
  'assaultBattles',
  'territoryBattles',
  'raidRewards',
  'territoryWar',
  'conquest',
  'specialEvents',
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
    crystalIncome: v.optional(placeholderSectionValidator),
    assaultBattles: v.optional(assaultBattlesValidator),
    territoryBattles: v.optional(placeholderSectionValidator),
    raidRewards: v.optional(placeholderSectionValidator),
    territoryWar: v.optional(placeholderSectionValidator),
    conquest: v.optional(placeholderSectionValidator),
    specialEvents: v.optional(placeholderSectionValidator),
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
