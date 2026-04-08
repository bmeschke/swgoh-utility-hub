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
import SelectRow from '@/features/income/SelectRow'

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
            <SelectRow
              key={battle}
              label={battle}
              sublabel="1×/mo"
              value={value}
              displayValue={labels[value as ShortABTier & StandardABTier]}
              onValueChange={(v) =>
                onChange({ ...inputs, [battle]: v as StandardABTier | ShortABTier })
              }
              options={tiers.map((t) => ({
                value: t,
                label: labels[t as ShortABTier & StandardABTier],
              }))}
            />
          )
        })}
      </div>
    </div>
  )
}
