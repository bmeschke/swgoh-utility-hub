import { FLEET_ARENA_RANK_LABELS, type FleetArenaRank, type FleetArenaInputs } from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const RANKS: FleetArenaRank[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6-10',
  '11-20',
  '21-50',
  '51-100',
  '101-200',
  '201-500',
  '501+',
]

interface Props {
  inputs: FleetArenaInputs
  onChange: (inputs: FleetArenaInputs) => void
}

export default function FleetArenaSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select your typical daily rank at payout time.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="Daily Rank"
          value={inputs.rank}
          displayValue={FLEET_ARENA_RANK_LABELS[inputs.rank]}
          onValueChange={(v) => onChange({ rank: v as FleetArenaRank })}
          options={RANKS.map((r) => ({ value: r, label: FLEET_ARENA_RANK_LABELS[r] }))}
        />
      </div>
    </div>
  )
}
