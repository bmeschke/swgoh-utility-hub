import {
  GAC_LEAGUE_LABELS,
  type GACLeague,
  type GACDivision,
  type KyberD1Bracket,
  type GrandArenaInputs,
} from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const LEAGUES: GACLeague[] = ['Kyber', 'Aurodium', 'Chromium', 'Bronzium', 'Carbonite']

// Kyber D1 is split into rank brackets — all folded into the division select
const KYBER_DIVISIONS = [
  { value: '1:1-50', label: 'Division I (Top) — Rank 1–50' },
  { value: '1:51-250', label: 'Division I (Top) — Rank 51–250' },
  { value: '1:251-500', label: 'Division I (Top) — Rank 251–500' },
  { value: '1:501-1000', label: 'Division I (Top) — Rank 501–1,000' },
  { value: '1:1001+', label: 'Division I (Top) — Rank 1,001+' },
  { value: '2', label: 'Division II' },
  { value: '3', label: 'Division III' },
  { value: '4', label: 'Division IV' },
  { value: '5', label: 'Division V (Bottom)' },
]

const STANDARD_DIVISIONS = [
  { value: '1', label: 'Division I (Top)' },
  { value: '2', label: 'Division II' },
  { value: '3', label: 'Division III' },
  { value: '4', label: 'Division IV' },
  { value: '5', label: 'Division V (Bottom)' },
]

function currentDivisionValue(inputs: GrandArenaInputs): string {
  if (inputs.league === 'Kyber' && inputs.division === 1) {
    return `1:${inputs.kyberD1Bracket ?? '1001+'}`
  }
  return String(inputs.division)
}

function applyDivisionChange(inputs: GrandArenaInputs, value: string): GrandArenaInputs {
  if (value.startsWith('1:')) {
    return { ...inputs, division: 1, kyberD1Bracket: value.slice(2) as KyberD1Bracket }
  }
  return { ...inputs, division: Number(value) as GACDivision, kyberD1Bracket: undefined }
}

function applyLeagueChange(inputs: GrandArenaInputs, league: GACLeague): GrandArenaInputs {
  const next: GrandArenaInputs = { ...inputs, league }
  if (league === 'Kyber' && next.division === 1 && !next.kyberD1Bracket) {
    next.kyberD1Bracket = '1001+'
  }
  if (league !== 'Kyber') {
    next.kyberD1Bracket = undefined
  }
  return next
}

interface Props {
  inputs: GrandArenaInputs
  onChange: (inputs: GrandArenaInputs) => void
}

export default function GrandArenaSection({ inputs, onChange }: Props) {
  const divisionOptions = inputs.league === 'Kyber' ? KYBER_DIVISIONS : STANDARD_DIVISIONS
  const divValue = currentDivisionValue(inputs)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select your current Grand Arena league and division.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="League"
          value={inputs.league}
          onValueChange={(v) => onChange(applyLeagueChange(inputs, v as GACLeague))}
          options={LEAGUES.map((l) => ({ value: l, label: GAC_LEAGUE_LABELS[l] }))}
        />
        <SelectRow
          label="Division"
          value={divValue}
          displayValue={divisionOptions.find((o) => o.value === divValue)?.label}
          onValueChange={(v) => onChange(applyDivisionChange(inputs, v))}
          options={divisionOptions}
          width="w-56"
        />
      </div>
    </div>
  )
}
