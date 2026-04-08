import {
  RAID_KEYS,
  RAID_DEFINITIONS,
  getRaidDefinition,
  raidOptionLabel,
  type RaidKey,
  type RaidInputs,
} from '@/lib/income'
import SelectRow from '@/features/income/SelectRow'

interface Props {
  inputs: RaidInputs
  onChange: (inputs: RaidInputs) => void
}

export default function RaidRewardsSection({ inputs, onChange }: Props) {
  const def = getRaidDefinition(inputs.raidKey)
  const hasPersonal = def.personal !== null

  const guildEntry = def.guild[inputs.guildChestIdx] ?? def.guild[0]
  const personalEntry =
    hasPersonal && inputs.personalMilestoneIdx !== null
      ? def.personal![inputs.personalMilestoneIdx]
      : null

  function handleRaidChange(key: RaidKey) {
    const newDef = getRaidDefinition(key)
    onChange({
      raidKey: key,
      guildChestIdx: 0,
      personalMilestoneIdx: newDef.personal !== null ? 0 : null,
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select your raid, guild chest, and personal score milestone. Assumes 4 raids per month.
        Personal score rewards are cumulative (milestones 1 through your selected milestone).
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SelectRow
          label="Raid"
          value={inputs.raidKey}
          displayValue={def.name}
          onValueChange={(v) => handleRaidChange(v as RaidKey)}
          options={RAID_KEYS.map((k) => ({
            value: k,
            label: RAID_DEFINITIONS.find((r) => r.key === k)!.name,
          }))}
          width="w-52"
        />
        <SelectRow
          label="Guild Chest"
          value={String(inputs.guildChestIdx)}
          displayValue={raidOptionLabel(guildEntry)}
          onValueChange={(v) => onChange({ ...inputs, guildChestIdx: Number(v) })}
          options={def.guild.map((entry, idx) => ({
            value: String(idx),
            label: raidOptionLabel(entry),
          }))}
          width="w-52"
        />
        <SelectRow
          label="Personal Score"
          value={String(inputs.personalMilestoneIdx ?? 0)}
          displayValue={personalEntry ? raidOptionLabel(personalEntry) : 'N/A'}
          onValueChange={(v) => onChange({ ...inputs, personalMilestoneIdx: Number(v) })}
          options={
            hasPersonal
              ? def.personal!.map((entry, idx) => ({
                  value: String(idx),
                  label: raidOptionLabel(entry),
                }))
              : []
          }
          width="w-52"
          disabled={!hasPersonal}
        />
      </div>
    </div>
  )
}
