import {
  RAID_KEYS,
  RAID_DEFINITIONS,
  getRaidDefinition,
  raidOptionLabel,
  type RaidKey,
  type RaidInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
        {/* Raid selector */}
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Raid</span>
          <Select value={inputs.raidKey} onValueChange={(v) => v && handleRaidChange(v as RaidKey)}>
            <SelectTrigger className="w-52 h-8 text-xs">
              <SelectValue>{def.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {RAID_KEYS.map((key) => {
                const d = RAID_DEFINITIONS.find((r) => r.key === key)!
                return (
                  <SelectItem key={key} value={key} className="text-xs">
                    {d.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Guild chest selector */}
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Guild Chest</span>
          <Select
            value={String(inputs.guildChestIdx)}
            onValueChange={(v) => v && onChange({ ...inputs, guildChestIdx: Number(v) })}
          >
            <SelectTrigger className="w-52 h-8 text-xs">
              <SelectValue>{raidOptionLabel(guildEntry)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {def.guild.map((entry, idx) => (
                <SelectItem key={idx} value={String(idx)} className="text-xs">
                  {raidOptionLabel(entry)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Personal score selector — disabled with N/A if raid has no personal */}
        <div
          className={`flex items-center justify-between gap-3 rounded border p-2 ${
            !hasPersonal ? 'opacity-50' : ''
          }`}
        >
          <span className="text-sm font-medium">Personal Score</span>
          {hasPersonal ? (
            <Select
              value={String(inputs.personalMilestoneIdx ?? 0)}
              onValueChange={(v) => v && onChange({ ...inputs, personalMilestoneIdx: Number(v) })}
            >
              <SelectTrigger className="w-52 h-8 text-xs">
                <SelectValue>{personalEntry ? raidOptionLabel(personalEntry) : 'N/A'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {def.personal!.map((entry, idx) => (
                  <SelectItem key={idx} value={String(idx)} className="text-xs">
                    {raidOptionLabel(entry)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="w-52 h-8 rounded border border-input bg-muted/30 px-3 flex items-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
