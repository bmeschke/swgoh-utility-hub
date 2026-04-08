import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { InfoIcon } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import IncomeTabBar, { type IncomeTab } from '@/features/income/IncomeTabBar'
import IncomeTotals from '@/features/income/IncomeTotals'
import AssaultBattlesSection from '@/features/income/sections/AssaultBattlesSection'
import SpecialEventsSection from '@/features/income/sections/SpecialEventsSection'
import ConquestSection from '@/features/income/sections/ConquestSection'
import PassesSection from '@/features/income/sections/PassesSection'
import GrandArenaSection from '@/features/income/sections/GrandArenaSection'
import FleetArenaSection from '@/features/income/sections/FleetArenaSection'
import TerritoryWarSection from '@/features/income/sections/TerritoryWarSection'
import RaidRewardsSection from '@/features/income/sections/RaidRewardsSection'
import TerritoryBattlesSection from '@/features/income/sections/TerritoryBattlesSection'

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

// ─── Assumptions Modal ────────────────────────────────────────────────────────

function AssumptionsModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          />
        }
      >
        <InfoIcon className="size-4" />
        Assumptions
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Income Assumptions</DialogTitle>
          <DialogDescription>
            Some inputs are fixed to keep the calculator simple. Here's what's assumed for all
            players regardless of your selections.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <Separator />
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Daily Activities</span> — completed
              every day (+70 crystals/day, +1 Omega/day); includes +25 crystals/day from Galactic
              War
            </li>
            <li>
              <span className="font-medium text-foreground">Daily login</span> — login reward
              claimed every day
            </li>
            <li>
              <span className="font-medium text-foreground">Grand Arena</span> — 5 wins + 4 losses
              per season, always finishing 2nd–4th place
            </li>
            <li>
              <span className="font-medium text-foreground">Territory Wars</span> — 1 win + 1 loss
              per month (2 events total)
            </li>
            <li>
              <span className="font-medium text-foreground">Raids</span> — 4 raids per month
            </li>
            <li>
              <span className="font-medium text-foreground">Territory Battles</span> — Prize Box
              rewards are not included; the drop odds for Prize Box contents are unknown
            </li>
            <li>
              <span className="font-medium text-foreground">Episode Track</span> — track is fully
              completed (level 50) regardless of whether the Episode Pass is purchased
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{heading}</h3>
      {children}
    </div>
  )
}

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

  // Save helpers
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
        <AssumptionsModal />
      </div>

      {!isSignedIn && (
        <p className="text-sm text-muted-foreground border rounded px-3 py-2">
          Sign in to save your selections across sessions.
        </p>
      )}

      <IncomeTabBar active={activeTab} onChange={setActiveTab} />

      <div className="space-y-8">
        {activeTab === 'soloEvents' && (
          <>
            <Section heading="Assault Battles">
              <AssaultBattlesSection
                inputs={assaultInputs}
                onChange={(v) => save('assaultBattles', v, setLocalAssaultInputs)}
              />
            </Section>
            <Separator />
            <Section heading="Special Events">
              <SpecialEventsSection
                inputs={specialEventsInputs}
                onChange={(v) => save('specialEvents', v, setLocalSpecialEvents)}
              />
            </Section>
            <Separator />
            <Section heading="Conquest">
              <ConquestSection
                inputs={conquestInputs}
                onChange={(v) => save('conquest', v, setLocalConquest)}
              />
            </Section>
            <Separator />
            <Section heading="Passes">
              <PassesSection
                inputs={passesInputs}
                onChange={(v) => save('passes', v, setLocalPasses)}
              />
            </Section>
          </>
        )}

        {activeTab === 'pvp' && (
          <>
            <Section heading="Grand Arena">
              <GrandArenaSection
                inputs={grandArena}
                onChange={(v) => save('grandArena', v, setLocalGrandArena)}
              />
            </Section>
            <Separator />
            <Section heading="Fleet Arena">
              <FleetArenaSection
                inputs={fleetArena}
                onChange={(v) => save('fleetArena', v, setLocalFleetArena)}
              />
            </Section>
            <Separator />
            <Section heading="Territory Wars">
              <TerritoryWarSection
                inputs={twInputs}
                onChange={(v) => save('territoryWar', v, setLocalTW)}
              />
            </Section>
          </>
        )}

        {activeTab === 'guildEvents' && (
          <>
            <Section heading="Raids">
              <RaidRewardsSection
                inputs={raidInputs}
                onChange={(v) => save('raidRewards', v, setLocalRaid)}
              />
            </Section>
            <Separator />
            <Section heading="Territory Battles">
              <TerritoryBattlesSection
                inputs={tbInputs}
                onChange={(v) => save('territoryBattles', v, setLocalTB)}
              />
            </Section>
          </>
        )}
      </div>

      <IncomeTotals totals={total} breakdown={breakdown} />
    </div>
  )
}
