import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../_generated/server'

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError('Not authenticated')
  }
  const adminId = process.env.ADMIN_USER_ID
  if (!adminId || identity.subject !== adminId) {
    throw new ConvexError('Access denied: admin only')
  }
  return identity
}
