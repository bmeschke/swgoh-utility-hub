import {
  CONQUEST_EASY_CRATE_LABELS,
  CONQUEST_NORMAL_CRATE_LABELS,
  CONQUEST_HARD_CRATE_LABELS,
  type ConquestInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  inputs: ConquestInputs
  onChange: (inputs: ConquestInputs) => void
}

export default function ConquestSection({ inputs, onChange }: Props) {
  const crateLabels =
    inputs.mode === 'Hard'
      ? CONQUEST_HARD_CRATE_LABELS
      : inputs.mode === 'Normal'
        ? CONQUEST_NORMAL_CRATE_LABELS
        : CONQUEST_EASY_CRATE_LABELS
  const crateTiers = Object.keys(crateLabels).map(Number)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select which mode you play and the highest crate tier you typically reach. Reward data
        pending — totals will update once added.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Mode</span>
          <Select
            value={inputs.mode}
            onValueChange={(v) =>
              v && onChange({ mode: v as 'Easy' | 'Normal' | 'Hard', crateTier: 1 })
            }
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy" className="text-xs">
                Easy
              </SelectItem>
              <SelectItem value="Normal" className="text-xs">
                Normal
              </SelectItem>
              <SelectItem value="Hard" className="text-xs">
                Hard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Crate Tier</span>
          <Select
            value={String(inputs.crateTier)}
            onValueChange={(v) => v && onChange({ ...inputs, crateTier: Number(v) })}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crateTiers.map((tier) => (
                <SelectItem key={tier} value={String(tier)} className="text-xs">
                  {crateLabels[tier]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
