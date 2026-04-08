import { Separator } from '@/components/ui/separator'
import RaidRewardsSection from '@/features/income/sections/RaidRewardsSection'
import TerritoryBattlesSection from '@/features/income/sections/TerritoryBattlesSection'
import { type RaidInputs, type TerritoryBattleInputs } from '@/lib/income'

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{heading}</h3>
      {children}
    </div>
  )
}

interface Props {
  raidInputs: RaidInputs
  tbInputs: TerritoryBattleInputs
  onRaidChange: (v: RaidInputs) => void
  onTBChange: (v: TerritoryBattleInputs) => void
}

export default function GuildEventsTab({ raidInputs, tbInputs, onRaidChange, onTBChange }: Props) {
  return (
    <>
      <Section heading="Raids">
        <RaidRewardsSection inputs={raidInputs} onChange={onRaidChange} />
      </Section>
      <Separator />
      <Section heading="Territory Battles">
        <TerritoryBattlesSection inputs={tbInputs} onChange={onTBChange} />
      </Section>
    </>
  )
}
