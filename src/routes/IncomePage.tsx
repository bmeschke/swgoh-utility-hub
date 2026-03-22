import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import IncomeTabBar, { type IncomeTab } from '@/features/income/IncomeTabBar'
import IncomeTotals from '@/features/income/IncomeTotals'
import CrystalIncomeSection from '@/features/income/sections/CrystalIncomeSection'
import AssaultBattlesSection from '@/features/income/sections/AssaultBattlesSection'
import TerritoryBattlesSection from '@/features/income/sections/TerritoryBattlesSection'
import RaidRewardsSection from '@/features/income/sections/RaidRewardsSection'
import TerritoryWarSection from '@/features/income/sections/TerritoryWarSection'
import ConquestSection from '@/features/income/sections/ConquestSection'
import SpecialEventsSection from '@/features/income/sections/SpecialEventsSection'
import {
  computeAssaultBattleIncome,
  computeCrystalIncome,
  computeTerritoryBattleIncome,
  computeRaidRewardsIncome,
  computeTerritoryWarIncome,
  computeConquestIncome,
  computeSpecialEventsIncome,
  sumIncome,
  type AssaultBattleInputs,
  ZERO_INCOME,
} from '@/lib/income'

export default function IncomePage() {
  const [activeTab, setActiveTab] = useState<IncomeTab>('crystalIncome')

  const profile = useQuery(api.income.get)
  const upsert = useMutation(api.income.upsert)

  // Local state for each section — initialized from saved profile once loaded
  const [assaultBattles, setAssaultBattles] = useState<AssaultBattleInputs>({})

  // Sync from Convex when profile loads (only on first load)
  const [synced, setSynced] = useState(false)
  if (profile !== undefined && !synced) {
    if (profile?.assaultBattles) setAssaultBattles(profile.assaultBattles as AssaultBattleInputs)
    setSynced(true)
  }

  const handleAssaultBattlesChange = useCallback(
    (inputs: AssaultBattleInputs) => {
      setAssaultBattles(inputs)
      upsert({ assaultBattles: inputs }).catch(console.error)
    },
    [upsert]
  )

  const totals = sumIncome(
    computeCrystalIncome(null),
    computeAssaultBattleIncome(assaultBattles),
    computeTerritoryBattleIncome(null),
    computeRaidRewardsIncome(null),
    computeTerritoryWarIncome(null),
    computeConquestIncome(null),
    computeSpecialEventsIncome(null)
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Income Calculator</h1>

      <div className="space-y-0">
        <IncomeTabBar active={activeTab} onChange={setActiveTab} />
        <div className="rounded-b-lg rounded-tr-lg border border-t-0 p-4 min-h-40">
          {activeTab === 'crystalIncome' && <CrystalIncomeSection />}
          {activeTab === 'assaultBattles' && (
            <AssaultBattlesSection
              inputs={assaultBattles}
              onChange={handleAssaultBattlesChange}
            />
          )}
          {activeTab === 'territoryBattles' && <TerritoryBattlesSection />}
          {activeTab === 'raidRewards' && <RaidRewardsSection />}
          {activeTab === 'territoryWar' && <TerritoryWarSection />}
          {activeTab === 'conquest' && <ConquestSection />}
          {activeTab === 'specialEvents' && <SpecialEventsSection />}
        </div>
      </div>

      <IncomeTotals totals={profile === undefined ? ZERO_INCOME : totals} />
    </div>
  )
}
