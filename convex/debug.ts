import { query } from './_generated/server'

/** Temporary debug query — returns identity fields for the logged-in user.
 *  Use this to find the correct value for ADMIN_USER_ID, then delete this file. */
export const whoAmI = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    return {
      subject: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
    }
  },
})
