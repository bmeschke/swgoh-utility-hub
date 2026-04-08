import {
  SR1_TIER_OPTIONS,
  SR2_TIER_OPTIONS,
  SR3_TIER_OPTIONS,
  COVEN_TIER_OPTIONS,
  type SRITier,
  type SRIITier,
  type SRIIITier,
  type CovenTier,
  type SpecialEventsInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type EventTierOption = { value: string; label: string }

const EVENTS: {
  key: keyof SpecialEventsInputs
  label: string
  frequency: string
  options: EventTierOption[]
}[] = [
  {
    key: 'smugglersRun1',
    label: "Smuggler's Run I",
    frequency: '2×/mo',
    options: SR1_TIER_OPTIONS,
  },
  {
    key: 'smugglersRun2',
    label: "Smuggler's Run II",
    frequency: '2×/mo',
    options: SR2_TIER_OPTIONS,
  },
  {
    key: 'smugglersRun3',
    label: "Smuggler's Run III",
    frequency: '2×/mo',
    options: SR3_TIER_OPTIONS,
  },
  {
    key: 'covenOfShadows',
    label: 'Coven of Shadows',
    frequency: '1×/mo',
    options: COVEN_TIER_OPTIONS,
  },
]

interface Props {
  inputs: SpecialEventsInputs
  onChange: (inputs: SpecialEventsInputs) => void
}

export default function SpecialEventsSection({ inputs, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {EVENTS.map(({ key, label, frequency, options }) => (
        <div key={key} className="flex items-center justify-between gap-3 rounded border p-2">
          <div className="min-w-0">
            <span className="text-sm font-medium">{label}</span>
            <span className="ml-1.5 text-xs text-muted-foreground">{frequency}</span>
          </div>
          <Select
            value={inputs[key] as string}
            onValueChange={(v) => {
              if (!v) return
              if (key === 'smugglersRun1') onChange({ ...inputs, smugglersRun1: v as SRITier })
              else if (key === 'smugglersRun2')
                onChange({ ...inputs, smugglersRun2: v as SRIITier })
              else if (key === 'smugglersRun3')
                onChange({ ...inputs, smugglersRun3: v as SRIIITier })
              else onChange({ ...inputs, covenOfShadows: v as CovenTier })
            }}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label: tierLabel }) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {tierLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}
