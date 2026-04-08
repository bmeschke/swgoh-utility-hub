import {
  GAC_LEAGUE_LABELS,
  type GACLeague,
  type GACDivision,
  type GrandArenaInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">League</span>
          <Select
            value={inputs.league}
            onValueChange={(v) => v && onChange({ ...inputs, league: v as GACLeague })}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAGUES.map((league) => (
                <SelectItem key={league} value={league} className="text-xs">
                  {GAC_LEAGUE_LABELS[league]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Division</span>
          <Select
            value={String(inputs.division)}
            onValueChange={(v) => v && onChange({ ...inputs, division: Number(v) as GACDivision })}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue>{DIVISIONS.find((d) => d.value === inputs.division)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DIVISIONS.map(({ value, label }) => (
                <SelectItem key={value} value={String(value)} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
