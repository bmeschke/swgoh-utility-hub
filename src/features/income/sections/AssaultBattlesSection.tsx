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

// Full list of assault battles with faction subtitles
const ASSAULT_BATTLES: { name: string; subtitle: string }[] = [
  { name: 'Fanatical Devotion', subtitle: 'Inquisitorius' },
  { name: 'Forest Moon', subtitle: 'Empire or Droid' },
  { name: 'Ground War', subtitle: 'Ewok or Jedi' },
  { name: 'Military Might', subtitle: 'Rebel or Clone' },
  { name: 'Places of Power', subtitle: 'First Order or Sith' },
  { name: 'Rebel Roundup', subtitle: 'Bounty Hunter or Imperial Trooper' },
  { name: 'Secrets and Shadows', subtitle: 'Phoenix or Nightsister' },
  { name: 'Peridea Patrol', subtitle: 'Enoch, Death Trooper (Peridea) & Night Trooper' },
  { name: 'Duel of the Fates', subtitle: 'Master Qui-Gon & Padawan Obi-Wan' },
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
        {ASSAULT_BATTLES.map(({ name, subtitle }) => {
          const isShort = SHORT_TIER_BATTLES.includes(name)
          const tiers = isShort ? SHORT_AB_TIERS : STANDARD_AB_TIERS
          const labels = isShort ? SHORT_AB_TIER_LABELS : STANDARD_AB_TIER_LABELS
          const value = (inputs[name] as string) ?? 'none'

          return (
            <SelectRow
              key={name}
              label={name}
              sublabel="1×/mo"
              description={subtitle}
              value={value}
              displayValue={labels[value as ShortABTier & StandardABTier]}
              onValueChange={(v) =>
                onChange({ ...inputs, [name]: v as StandardABTier | ShortABTier })
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
