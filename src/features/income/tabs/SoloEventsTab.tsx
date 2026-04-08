import { Separator } from '@/components/ui/separator'
import AssaultBattlesSection from '@/features/income/sections/AssaultBattlesSection'
import SpecialEventsSection from '@/features/income/sections/SpecialEventsSection'
import ConquestSection from '@/features/income/sections/ConquestSection'
import PassesSection from '@/features/income/sections/PassesSection'
import {
  type AssaultBattleInputs,
  type SpecialEventsInputs,
  type ConquestInputs,
  type PassesInputs,
} from '@/lib/income'

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{heading}</h3>
      {children}
    </div>
  )
}

interface Props {
  assaultInputs: AssaultBattleInputs
  specialEventsInputs: SpecialEventsInputs
  conquestInputs: ConquestInputs
  passesInputs: PassesInputs
  onAssaultChange: (v: AssaultBattleInputs) => void
  onSpecialEventsChange: (v: SpecialEventsInputs) => void
  onConquestChange: (v: ConquestInputs) => void
  onPassesChange: (v: PassesInputs) => void
}

export default function SoloEventsTab({
  assaultInputs,
  specialEventsInputs,
  conquestInputs,
  passesInputs,
  onAssaultChange,
  onSpecialEventsChange,
  onConquestChange,
  onPassesChange,
}: Props) {
  return (
    <>
      <Section heading="Assault Battles">
        <AssaultBattlesSection inputs={assaultInputs} onChange={onAssaultChange} />
      </Section>
      <Separator />
      <Section heading="Special Events">
        <SpecialEventsSection inputs={specialEventsInputs} onChange={onSpecialEventsChange} />
      </Section>
      <Separator />
      <Section heading="Conquest">
        <ConquestSection inputs={conquestInputs} onChange={onConquestChange} />
      </Section>
      <Separator />
      <Section heading="Passes">
        <PassesSection inputs={passesInputs} onChange={onPassesChange} />
      </Section>
    </>
  )
}
