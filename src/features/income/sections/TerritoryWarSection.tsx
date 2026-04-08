import { TW_BRACKET_LABELS, type TWGuildBracket, type TerritoryWarInputs } from '@/lib/income'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const BRACKETS: TWGuildBracket[] = [
  '380M+',
  '300-380M',
  '200-300M',
  '100-200M',
  '50-100M',
  '10-50M',
  '<10M',
]

interface Props {
  inputs: TerritoryWarInputs
  onChange: (inputs: TerritoryWarInputs) => void
}

export default function TerritoryWarSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Select your guild's GP bracket.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded border p-2">
          <span className="text-sm font-medium">Guild GP</span>
          <Select
            value={inputs.guildGP}
            onValueChange={(v) => v && onChange({ ...inputs, guildGP: v as TWGuildBracket })}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue>{TW_BRACKET_LABELS[inputs.guildGP]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {BRACKETS.map((bracket) => (
                <SelectItem key={bracket} value={bracket} className="text-xs">
                  {TW_BRACKET_LABELS[bracket]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
