import { Separator } from '@/components/ui/separator'
import GrandArenaSection from '@/features/income/sections/GrandArenaSection'
import FleetArenaSection from '@/features/income/sections/FleetArenaSection'
import TerritoryWarSection from '@/features/income/sections/TerritoryWarSection'
import { type GrandArenaInputs, type FleetArenaInputs, type TerritoryWarInputs } from '@/lib/income'

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{heading}</h3>
      {children}
    </div>
  )
}

interface Props {
  grandArena: GrandArenaInputs
  fleetArena: FleetArenaInputs
  twInputs: TerritoryWarInputs
  onGrandArenaChange: (v: GrandArenaInputs) => void
  onFleetArenaChange: (v: FleetArenaInputs) => void
  onTWChange: (v: TerritoryWarInputs) => void
}

export default function PvPTab({
  grandArena,
  fleetArena,
  twInputs,
  onGrandArenaChange,
  onFleetArenaChange,
  onTWChange,
}: Props) {
  return (
    <>
      <Section heading="Grand Arena">
        <GrandArenaSection inputs={grandArena} onChange={onGrandArenaChange} />
      </Section>
      <Separator />
      <Section heading="Fleet Arena">
        <FleetArenaSection inputs={fleetArena} onChange={onFleetArenaChange} />
      </Section>
      <Separator />
      <Section heading="Territory Wars">
        <TerritoryWarSection inputs={twInputs} onChange={onTWChange} />
      </Section>
    </>
  )
}
