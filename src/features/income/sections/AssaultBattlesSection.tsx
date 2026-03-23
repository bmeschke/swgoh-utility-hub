import {
  SHORT_TIER_BATTLES,
  SHORT_AB_TIER_LABELS,
  STANDARD_AB_TIER_LABELS,
  SHORT_AB_TIERS,
  STANDARD_AB_TIERS,
  type AssaultBattleInputs,
  type ShortABTier,
  type StandardABTier,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Full list of assault battles
const ASSAULT_BATTLES = [
  'Fanatical Devotion',
  'Forest Moon',
  'Ground War',
  'Military Might',
  'Places of Power',
  'Rebel Roundup',
  'Secrets and Shadows',
  'Peridea Patrol',
  'Duel of the Fates',
]

interface Props {
  inputs: AssaultBattleInputs
  onChange: (inputs: AssaultBattleInputs) => void
}

export default function AssaultBattlesSection({ inputs, onChange }: Props) {
  const handleChange = (battle: string, tier: string) => {
    onChange({ ...inputs, [battle]: tier as StandardABTier | ShortABTier })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the highest tier you complete for each Assault Battle.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ASSAULT_BATTLES.map((battle) => {
          const isShort = SHORT_TIER_BATTLES.includes(battle)
          const tiers = isShort ? SHORT_AB_TIERS : STANDARD_AB_TIERS
          const labels = isShort ? SHORT_AB_TIER_LABELS : STANDARD_AB_TIER_LABELS
          const value = (inputs[battle] as string) ?? 'none'

          return (
            <div key={battle} className="flex items-center justify-between gap-3 rounded border p-2">
              <span className="text-sm font-medium">{battle}</span>
              <Select value={value} onValueChange={(v) => v && handleChange(battle, v)}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier) => (
                    <SelectItem key={tier} value={tier} className="text-xs">
                      {labels[tier as ShortABTier & StandardABTier]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
      </div>
    </div>
  )
}
