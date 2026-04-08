import { FLEET_ARENA_RANK_LABELS, type FleetArenaRank, type FleetArenaInputs } from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Daily Rank</span>
          <Select
            value={inputs.rank}
            onValueChange={(v) => v && onChange({ rank: v as FleetArenaRank })}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue>{FLEET_ARENA_RANK_LABELS[inputs.rank]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {RANKS.map((rank) => (
                <SelectItem key={rank} value={rank} className="text-xs">
                  {FLEET_ARENA_RANK_LABELS[rank]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
