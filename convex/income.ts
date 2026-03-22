import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

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
    crystalIncome: v.optional(v.any()),
    assaultBattles: v.optional(v.any()),
    territoryBattles: v.optional(v.any()),
    raidRewards: v.optional(v.any()),
    territoryWar: v.optional(v.any()),
    conquest: v.optional(v.any()),
    specialEvents: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const existing = await ctx.db
      .query('incomeProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', identity.tokenIdentifier))
      .unique()

    const patch = {
      updatedAt: Date.now(),
      ...Object.fromEntries(
        Object.entries(args).filter(([, v]) => v !== undefined)
      ),
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
    } else {
      await ctx.db.insert('incomeProfiles', {
        userId: identity.tokenIdentifier,
        updatedAt: Date.now(),
        ...args,
      })
    }
  },
})
