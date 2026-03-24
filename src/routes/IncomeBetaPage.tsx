import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { sumIncome, computeAssaultBattleIncome } from '@/lib/income'
import type { AssaultBattleInputs } from '@/lib/income'
import IncomeTabBar, { type IncomeTab } from '@/features/income/IncomeTabBar'
import IncomeTotals from '@/features/income/IncomeTotals'
import AssaultBattlesSection from '@/features/income/sections/AssaultBattlesSection'
import GrandArenaSection from '@/features/income/sections/GrandArenaSection'
import TerritoryBattlesSection from '@/features/income/sections/TerritoryBattlesSection'
import RaidRewardsSection from '@/features/income/sections/RaidRewardsSection'
import TerritoryWarSection from '@/features/income/sections/TerritoryWarSection'
import ConquestSection from '@/features/income/sections/ConquestSection'
import SpecialEventsSection from '@/features/income/sections/SpecialEventsSection'

export default function IncomeBetaPage() {
  const { isSignedIn } = useUser()
  const [activeTab, setActiveTab] = useState<IncomeTab>('grandArena')
  const [localAssaultInputs, setLocalAssaultInputs] = useState<AssaultBattleInputs>({})

  // These hooks are always called; they return null/no-op when unauthenticated
  const profile = useQuery(api.income.get)
  const upsert = useMutation(api.income.upsert)

  const assaultInputs: AssaultBattleInputs = isSignedIn
    ? (profile?.assaultBattles ?? {})
    : localAssaultInputs

  function saveAssaultBattles(inputs: AssaultBattleInputs) {
    if (isSignedIn) {
      upsert({ assaultBattles: inputs })
    } else {
      setLocalAssaultInputs(inputs)
    }
  }

  const total = sumIncome(computeAssaultBattleIncome(assaultInputs))

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">Income Calculator</h1>
        <span className="text-sm text-muted-foreground">beta</span>
      </div>

      {!isSignedIn && (
        <p className="text-sm text-muted-foreground border rounded px-3 py-2">
          Sign in to save your selections across sessions.
        </p>
      )}

      <IncomeTabBar active={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'grandArena' && <GrandArenaSection />}
        {activeTab === 'assaultBattles' && (
          <AssaultBattlesSection inputs={assaultInputs} onChange={saveAssaultBattles} />
        )}
        {activeTab === 'territoryBattles' && <TerritoryBattlesSection />}
        {activeTab === 'raidRewards' && <RaidRewardsSection />}
        {activeTab === 'territoryWar' && <TerritoryWarSection />}
        {activeTab === 'conquest' && <ConquestSection />}
        {activeTab === 'specialEvents' && <SpecialEventsSection />}
      </div>

      <IncomeTotals totals={total} />
    </div>
  )
}
