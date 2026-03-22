import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function DebugPage() {
  const identity = useQuery(api.debug.whoAmI)

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-xl font-bold">Identity Debug</h1>
      {identity === undefined && <p className="text-muted-foreground">Loading...</p>}
      {identity === null && <p className="text-muted-foreground">Not logged in.</p>}
      {identity && (
        <div className="space-y-2 rounded border p-4 font-mono text-sm">
          <div>
            <span className="text-muted-foreground">subject: </span>
            <span className="select-all">{identity.subject}</span>
          </div>
          <div>
            <span className="text-muted-foreground">tokenIdentifier: </span>
            <span className="select-all">{identity.tokenIdentifier}</span>
          </div>
        </div>
      )}
    </div>
  )
}
