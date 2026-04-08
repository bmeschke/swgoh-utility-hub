import {
  GAC_LEAGUE_LABELS,
  type GACLeague,
  type GACDivision,
  type GrandArenaInputs,
} from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const LEAGUES: GACLeague[] = ['Kyber', 'Aurodium', 'Chromium', 'Bronzium', 'Carbonite']
const DIVISIONS: { value: GACDivision; label: string }[] = [
  { value: 1, label: 'Division I (Top)' },
  { value: 2, label: 'Division II' },
  { value: 3, label: 'Division III' },
  { value: 4, label: 'Division IV' },
  { value: 5, label: 'Division V (Bottom)' },
]

interface Props {
  inputs: GrandArenaInputs
  onChange: (inputs: GrandArenaInputs) => void
}

export default function GrandArenaSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select your current Grand Arena league and division.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="League"
          value={inputs.league}
          onValueChange={(v) => onChange({ ...inputs, league: v as GACLeague })}
          options={LEAGUES.map((l) => ({ value: l, label: GAC_LEAGUE_LABELS[l] }))}
        />
        <SelectRow
          label="Division"
          value={String(inputs.division)}
          displayValue={DIVISIONS.find((d) => d.value === inputs.division)?.label}
          onValueChange={(v) => onChange({ ...inputs, division: Number(v) as GACDivision })}
          options={DIVISIONS.map((d) => ({ value: String(d.value), label: d.label }))}
        />
      </div>
    </div>
  )
}
