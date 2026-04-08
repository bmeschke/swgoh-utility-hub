import { useState } from 'react'
import {
  TB_TYPE_LABELS,
  TB_MAX_STARS,
  type TBType,
  type TBSelection,
  type TerritoryBattleInputs,
} from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TB_TYPES: TBType[] = ['rote', 'lsGeo', 'dsGeo', 'lsHoth', 'dsHoth']

interface TBSelectorProps {
  label: string
  value: TBSelection
  onChange: (value: TBSelection) => void
}

function TBSelector({ label, value, onChange }: TBSelectorProps) {
  const [showDetail, setShowDetail] = useState(false)
  const maxStars = TB_MAX_STARS[value.tb]

  return (
    <div className="rounded border p-3 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Territory Battle</span>
          <Select
            value={value.tb}
            onValueChange={(v) => v && onChange({ ...value, tb: v as TBType, stars: 0 })}
          >
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

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Stars Achieved</span>
          <Select
            value={String(value.stars)}
            onValueChange={(v) => v && onChange({ ...value, stars: Number(v) })}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue>{value.stars} ★</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxStars + 1 }, (_, i) => i).map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">
                  {n} ★
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowDetail(!showDetail)}
        className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
      >
        {showDetail ? 'Hide details' : 'Add detail (special missions, bonus planets)'}
      </button>

      {showDetail && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Special Missions</span>
            <Select
              value={String(value.specialMissions ?? 0)}
              onValueChange={(v) =>
                v !== undefined && onChange({ ...value, specialMissions: Number(v) })
              }
            >
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Bonus Planets Maxed</span>
            <Select
              value={String(value.bonusPlanets ?? 0)}
              onValueChange={(v) =>
                v !== undefined && onChange({ ...value, bonusPlanets: Number(v) })
              }
            >
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3].map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  inputs: TerritoryBattleInputs
  onChange: (inputs: TerritoryBattleInputs) => void
}

export default function TerritoryBattlesSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the two Territory Battles your guild runs each month and the stars achieved. Reward
        data pending — totals will update once added.
      </p>
      <div className="space-y-3">
        <TBSelector
          label="TB 1"
          value={inputs.tb1}
          onChange={(tb1) => onChange({ ...inputs, tb1 })}
        />
        <TBSelector
          label="TB 2"
          value={inputs.tb2}
          onChange={(tb2) => onChange({ ...inputs, tb2 })}
        />
      </div>
    </div>
  )
}
