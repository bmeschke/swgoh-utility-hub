import { defineRateLimits } from 'convex-helpers/server/rateLimit'

const MINUTE = 60_000

export const { checkRateLimit, rateLimit, resetRateLimit } = defineRateLimits({
  // Authenticated user saving income profile — generous but bounded
  incomeUpsert: { kind: 'token bucket', rate: 20, period: MINUTE, capacity: 30 },

  // Admin mutations — lower rate, admin shouldn't be bulk-calling these
  adminMutation: { kind: 'token bucket', rate: 30, period: MINUTE, capacity: 40 },

  // Public queries — per-IP isn't available so this is a global ceiling
  // to prevent runaway clients from burning through Convex quotas
  publicQuery: { kind: 'token bucket', rate: 200, period: MINUTE, capacity: 300 },
})
