import { useState, type ReactNode } from 'react'
import {
  TB_TYPE_LABELS,
  TB_MAX_STARS,
  type TBType,
  type TBSelection,
  type TerritoryBattleInputs,
} from '@/lib/income'
import { TB_MISSIONS, type RegularMissionDef, type ChestMissionDef } from '@/lib/tb-data'
import SelectRow from '@/features/income/SelectRow'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TB_TYPES: TBType[] = ['rote', 'lsGeo', 'dsGeo', 'lsHoth', 'dsHoth']

const COMPLETION_OPTIONS = Array.from({ length: 51 }, (_, i) => ({
  value: String(i),
  label: String(i),
}))

const CHEST_OPTIONS = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
]

interface MissionRowProps {
  def: RegularMissionDef | ChestMissionDef
  value: number
  onChange: (v: number) => void
}

function MissionRow({ def, value, onChange }: MissionRowProps) {
  return (
    <SelectRow
      label={def.zone}
      sublabel={def.label}
      value={String(value)}
      onValueChange={(v) => onChange(Number(v))}
      options={def.type === 'chests' ? CHEST_OPTIONS : COMPLETION_OPTIONS}
      width="w-20"
    />
  )
}

interface TBSelectorProps {
  label: string
  value: TBSelection
  onChange: (value: TBSelection) => void
  disabled?: boolean
  headerAction?: ReactNode
}

function TBSelector({ label, value, onChange, disabled = false, headerAction }: TBSelectorProps) {
  const [showDetail, setShowDetail] = useState(false)
  const maxStars = TB_MAX_STARS[value.tb]
  const missionDefs = TB_MISSIONS[value.tb]
  const missions = value.missions ?? {}

  function setMission(key: string, count: number) {
    onChange({ ...value, missions: { ...missions, [key]: count } })
  }

  function handleTBChange(tb: TBType) {
    onChange({ tb, stars: 0, missions: {} })
  }

  return (
    <div className="rounded border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {headerAction}
      </div>
      <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* TB Type */}
          <div className="flex items-center justify-between gap-3 rounded border p-2">
            <span className="text-sm font-medium">Territory Battle</span>
            <Select value={value.tb} onValueChange={(v) => v && handleTBChange(v as TBType)}>
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue>{TB_TYPE_LABELS[value.tb]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TB_TYPES.map((tb) => (
                  <SelectItem key={tb} value={tb} className="text-xs">
                    {TB_TYPE_LABELS[tb]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stars */}
          <SelectRow
            label="Stars Achieved"
            value={String(value.stars)}
            displayValue={`${value.stars} ★`}
            onValueChange={(v) => onChange({ ...value, stars: Number(v) })}
            options={Array.from({ length: maxStars + 1 }, (_, i) => ({
              value: String(i),
              label: `${i} ★`,
            }))}
            width="w-24"
          />
        </div>

        {/* Mission toggle */}
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
        >
          {showDetail ? 'Hide missions' : 'Add mission completions'}
        </button>

        {showDetail && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {missionDefs.map((def) => (
              <MissionRow
                key={def.key}
                def={def}
                value={missions[def.key] ?? 0}
                onChange={(v) => setMission(def.key, v)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface Props {
  inputs: TerritoryBattleInputs
  onChange: (inputs: TerritoryBattleInputs) => void
}

export default function TerritoryBattlesSection({ inputs, onChange }: Props) {
  const [tb2SameAsTb1, setTb2SameAsTb1] = useState(false)

  function handleTb1Change(tb1: TBSelection) {
    if (tb2SameAsTb1) {
      onChange({ tb1, tb2: tb1 })
    } else {
      onChange({ ...inputs, tb1 })
    }
  }

  function handleSameAsTb1Toggle(checked: boolean) {
    setTb2SameAsTb1(checked)
    if (checked) {
      onChange({ ...inputs, tb2: inputs.tb1 })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the two Territory Battles your guild runs each month, the stars achieved, and
        optionally the mission completions for each zone.
      </p>
      <div className="space-y-3">
        <TBSelector label="TB 1" value={inputs.tb1} onChange={handleTb1Change} />
        <TBSelector
          label="TB 2"
          value={tb2SameAsTb1 ? inputs.tb1 : inputs.tb2}
          onChange={(tb2) => onChange({ ...inputs, tb2 })}
          disabled={tb2SameAsTb1}
          headerAction={
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={tb2SameAsTb1}
                onChange={(e) => handleSameAsTb1Toggle(e.target.checked)}
                className="h-3.5 w-3.5 rounded border accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">Same as TB 1</span>
            </label>
          }
        />
      </div>
    </div>
  )
}
