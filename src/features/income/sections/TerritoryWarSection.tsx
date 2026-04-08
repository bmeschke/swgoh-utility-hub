import { TW_BRACKET_LABELS, type TWGuildBracket, type TerritoryWarInputs } from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const BRACKETS: TWGuildBracket[] = [
  '380M+',
  '300-380M',
  '200-300M',
  '100-200M',
  '50-100M',
  '10-50M',
  '<10M',
]

interface Props {
  inputs: TerritoryWarInputs
  onChange: (inputs: TerritoryWarInputs) => void
}

export default function TerritoryWarSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Select your guild's GP bracket.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="Guild GP"
          value={inputs.guildGP}
          displayValue={TW_BRACKET_LABELS[inputs.guildGP]}
          onValueChange={(v) => onChange({ ...inputs, guildGP: v as TWGuildBracket })}
          options={BRACKETS.map((b) => ({ value: b, label: TW_BRACKET_LABELS[b] }))}
        />
      </div>
    </div>
  )
}
