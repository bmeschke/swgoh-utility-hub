import { TW_BRACKET_LABELS, type TWGuildBracket, type TerritoryWarInputs } from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const BRACKETS: TWGuildBracket[] = [
  '380M+',
  '360M-379M',
  '340M-359M',
  '320M-339M',
  '300M-319M',
  '280M-299M',
  '260M-279M',
  '240M-259M',
  '220M-239M',
  '200M-219M',
  '170M-199M',
  '140M-169M',
  '120M-139M',
  '100M-119M',
  '80M-99M',
  '60M-79M',
  '50M-59M',
  '40M-49M',
  '30M-39M',
  '20M-29M',
  '10M-19M',
  '5M-9M',
  '1M-4M',
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
