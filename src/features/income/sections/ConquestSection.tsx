import {
  CONQUEST_EASY_CRATE_LABELS,
  CONQUEST_NORMAL_CRATE_LABELS,
  CONQUEST_HARD_CRATE_LABELS,
  type ConquestInputs,
} from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

const MODE_OPTIONS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Hard', label: 'Hard' },
]

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
  const crateOptions = Object.keys(crateLabels).map((k) => ({
    value: k,
    label: crateLabels[Number(k)],
  }))

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select which mode you play and the highest crate tier you typically reach. Reward data
        pending — totals will update once added.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="Mode"
          value={inputs.mode}
          onValueChange={(v) => onChange({ mode: v as 'Easy' | 'Normal' | 'Hard', crateTier: 1 })}
          options={MODE_OPTIONS}
        />
        <SelectRow
          label="Crate Tier"
          value={String(inputs.crateTier)}
          onValueChange={(v) => onChange({ ...inputs, crateTier: Number(v) })}
          options={crateOptions}
        />
      </div>
    </div>
  )
}
