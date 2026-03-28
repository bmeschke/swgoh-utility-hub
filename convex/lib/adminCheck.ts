import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../_generated/server'

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  // In local dev (no ADMIN_USER_ID configured) bypass auth so the admin
  // UI works without a full Clerk + env-var setup.
  const adminId = process.env.ADMIN_USER_ID
  if (!adminId) return null

  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError('Not authenticated')
  }
  if (identity.subject !== adminId) {
    throw new ConvexError('Access denied: admin only')
  }
  return identity
}
