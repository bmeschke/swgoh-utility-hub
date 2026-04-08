import {
  SPECIAL_EVENT_TIER_OPTIONS,
  type SpecialEventTier,
  type SpecialEventsInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EVENTS: { key: keyof SpecialEventsInputs; label: string; frequency: string }[] = [
  { key: 'smugglersRun1', label: "Smuggler's Run I", frequency: '2×/mo' },
  { key: 'smugglersRun2', label: "Smuggler's Run II", frequency: '2×/mo' },
  { key: 'smugglersRun3', label: "Smuggler's Run III", frequency: '2×/mo' },
  { key: 'covenOfShadows', label: 'Coven of Shadows', frequency: '1×/mo' },
]

interface Props {
  inputs: SpecialEventsInputs
  onChange: (inputs: SpecialEventsInputs) => void
}

export default function SpecialEventsSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the highest tier you complete for each recurring special event. Reward data pending —
        tier options and totals will update once added.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {EVENTS.map(({ key, label, frequency }) => (
          <div key={key} className="flex items-center justify-between gap-3 rounded border p-2">
            <div className="min-w-0">
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-1.5 text-xs text-muted-foreground">{frequency}</span>
            </div>
            <Select
              value={inputs[key] as string}
              onValueChange={(v) => v && onChange({ ...inputs, [key]: v as SpecialEventTier })}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPECIAL_EVENT_TIER_OPTIONS.map(({ value, label: tierLabel }) => (
                  <SelectItem key={value} value={value} className="text-xs">
                    {tierLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
