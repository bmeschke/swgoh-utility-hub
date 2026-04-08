import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  sumIncome,
  computeSingleAssaultBattleIncome,
  computeGrandArenaIncome,
  computeFleetArenaIncome,
  computeTerritoryWarIncome,
  computeRaidGuildChestIncome,
  computeRaidPersonalIncome,
  computeTerritoryBattleIncome,
  computeConquestIncome,
  computeSmugglersRun1Income,
  computeSmugglersRun2Income,
  computeSmugglersRun3Income,
  computeCovenOfShadowsIncome,
  computePassesIncome,
  computeDailyActivitiesIncome,
  computeGalacticWarIncome,
  type AssaultBattleInputs,
  type GrandArenaInputs,
  type FleetArenaInputs,
  type TerritoryWarInputs,
  type RaidInputs,
  type TerritoryBattleInputs,
  type ConquestInputs,
  type SpecialEventsInputs,
  type PassesInputs,
} from '@/lib/income'
import IncomeTabBar, { type IncomeTab } from '@/features/income/IncomeTabBar'
import IncomeTotals from '@/features/income/IncomeTotals'
import IncomeAssumptionsModal from '@/features/income/IncomeAssumptionsModal'
import SoloEventsTab from '@/features/income/tabs/SoloEventsTab'
import PvPTab from '@/features/income/tabs/PvPTab'
import GuildEventsTab from '@/features/income/tabs/GuildEventsTab'

// ─── Default inputs ───────────────────────────────────────────────────────────

const DEFAULT_GRAND_ARENA: GrandArenaInputs = { league: 'Kyber', division: 1 }
const DEFAULT_FLEET_ARENA: FleetArenaInputs = { rank: '1' }
const DEFAULT_TW: TerritoryWarInputs = { guildGP: '380M+' }
const DEFAULT_RAID: RaidInputs = { raidKey: 'order66', guildChestIdx: 0, personalMilestoneIdx: 0 }
const DEFAULT_TB: TerritoryBattleInputs = {
  tb1: { tb: 'rote', stars: 0 },
  tb2: { tb: 'lsGeo', stars: 0 },
}
const DEFAULT_CONQUEST: ConquestInputs = { mode: 'Hard', crateTier: 1 }
const DEFAULT_SPECIAL_EVENTS: SpecialEventsInputs = {
  smugglersRun1: 'none',
  smugglersRun2: 'none',
  smugglersRun3: 'none',
  covenOfShadows: 'none',
}
const DEFAULT_PASSES: PassesInputs = { episodePass: false, conquestPass: false }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncomeBetaPage() {
  const { isSignedIn } = useUser()
  const [activeTab, setActiveTab] = useState<IncomeTab>('soloEvents')

  // Local state (used when not signed in)
  const [localAssaultInputs, setLocalAssaultInputs] = useState<AssaultBattleInputs>({})
  const [localGrandArena, setLocalGrandArena] = useState<GrandArenaInputs>(DEFAULT_GRAND_ARENA)
  const [localFleetArena, setLocalFleetArena] = useState<FleetArenaInputs>(DEFAULT_FLEET_ARENA)
  const [localTW, setLocalTW] = useState<TerritoryWarInputs>(DEFAULT_TW)
  const [localRaid, setLocalRaid] = useState<RaidInputs>(DEFAULT_RAID)
  const [localTB, setLocalTB] = useState<TerritoryBattleInputs>(DEFAULT_TB)
  const [localConquest, setLocalConquest] = useState<ConquestInputs>(DEFAULT_CONQUEST)
  const [localSpecialEvents, setLocalSpecialEvents] =
    useState<SpecialEventsInputs>(DEFAULT_SPECIAL_EVENTS)
  const [localPasses, setLocalPasses] = useState<PassesInputs>(DEFAULT_PASSES)

  // Convex hooks — always called; return null/no-op when unauthenticated
  const profile = useQuery(api.income.get)
  const upsert = useMutation(api.income.upsert)

  // Resolve inputs: prefer Convex profile when signed in, fall back to local state
  const assaultInputs = isSignedIn ? (profile?.assaultBattles ?? {}) : localAssaultInputs
  const grandArena = isSignedIn ? (profile?.grandArena ?? DEFAULT_GRAND_ARENA) : localGrandArena
  const fleetArena = isSignedIn ? (profile?.fleetArena ?? DEFAULT_FLEET_ARENA) : localFleetArena
  const twInputs = isSignedIn ? (profile?.territoryWar ?? DEFAULT_TW) : localTW
  const raidInputs = isSignedIn ? (profile?.raidRewards ?? DEFAULT_RAID) : localRaid
  const tbInputs = isSignedIn ? (profile?.territoryBattles ?? DEFAULT_TB) : localTB
  const conquestInputs = isSignedIn ? (profile?.conquest ?? DEFAULT_CONQUEST) : localConquest
  const specialEventsInputs = isSignedIn
    ? (profile?.specialEvents ?? DEFAULT_SPECIAL_EVENTS)
    : localSpecialEvents
  const passesInputs = isSignedIn ? (profile?.passes ?? DEFAULT_PASSES) : localPasses

  // Save helper — persists to Convex when signed in, else updates local state
  function save<T>(field: string, value: T, localSetter: (v: T) => void) {
    if (isSignedIn) {
      upsert({ [field]: value } as Parameters<typeof upsert>[0])
    } else {
      localSetter(value)
    }
  }

  // Totals — all sections always included regardless of active tab
  const breakdown = [
    { label: 'Daily Activities', result: computeDailyActivitiesIncome() },
    { label: 'Galactic War', result: computeGalacticWarIncome() },
    ...Object.entries(assaultInputs).map(([name, tier]) => ({
      label: name,
      result: computeSingleAssaultBattleIncome(name, tier),
    })),
    {
      label: "Smuggler's Run I",
      result: computeSmugglersRun1Income(specialEventsInputs.smugglersRun1),
    },
    {
      label: "Smuggler's Run II",
      result: computeSmugglersRun2Income(specialEventsInputs.smugglersRun2),
    },
    {
      label: "Smuggler's Run III",
      result: computeSmugglersRun3Income(specialEventsInputs.smugglersRun3),
    },
    {
      label: 'Coven of Shadows',
      result: computeCovenOfShadowsIncome(specialEventsInputs.covenOfShadows),
    },
    { label: 'Conquest', result: computeConquestIncome(conquestInputs) },
    { label: 'Passes', result: computePassesIncome(passesInputs) },
    { label: 'Grand Arena', result: computeGrandArenaIncome(grandArena) },
    { label: 'Fleet Arena', result: computeFleetArenaIncome(fleetArena) },
    { label: 'Territory Wars', result: computeTerritoryWarIncome(twInputs) },
    { label: 'Guild Chest', result: computeRaidGuildChestIncome(raidInputs) },
    { label: 'Personal Score', result: computeRaidPersonalIncome(raidInputs) },
    { label: 'Territory Battles', result: computeTerritoryBattleIncome(tbInputs) },
  ]
  const total = sumIncome(...breakdown.map((s) => s.result))

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Income Calculator</h1>
          <span className="text-sm text-muted-foreground">beta</span>
        </div>
        <IncomeAssumptionsModal />
      </div>

      {!isSignedIn && (
        <p className="text-sm text-muted-foreground border rounded px-3 py-2">
          Sign in to save your selections across sessions.
        </p>
      )}

      <IncomeTabBar active={activeTab} onChange={setActiveTab} />

      <div className="space-y-8">
        {activeTab === 'soloEvents' && (
          <SoloEventsTab
            assaultInputs={assaultInputs}
            specialEventsInputs={specialEventsInputs}
            conquestInputs={conquestInputs}
            passesInputs={passesInputs}
            onAssaultChange={(v) => save('assaultBattles', v, setLocalAssaultInputs)}
            onSpecialEventsChange={(v) => save('specialEvents', v, setLocalSpecialEvents)}
            onConquestChange={(v) => save('conquest', v, setLocalConquest)}
            onPassesChange={(v) => save('passes', v, setLocalPasses)}
          />
        )}

        {activeTab === 'pvp' && (
          <PvPTab
            grandArena={grandArena}
            fleetArena={fleetArena}
            twInputs={twInputs}
            onGrandArenaChange={(v) => save('grandArena', v, setLocalGrandArena)}
            onFleetArenaChange={(v) => save('fleetArena', v, setLocalFleetArena)}
            onTWChange={(v) => save('territoryWar', v, setLocalTW)}
          />
        )}

        {activeTab === 'guildEvents' && (
          <GuildEventsTab
            raidInputs={raidInputs}
            tbInputs={tbInputs}
            onRaidChange={(v) => save('raidRewards', v, setLocalRaid)}
            onTBChange={(v) => save('territoryBattles', v, setLocalTB)}
          />
        )}
      </div>

      <IncomeTotals totals={total} breakdown={breakdown} />
    </div>
  )
}
