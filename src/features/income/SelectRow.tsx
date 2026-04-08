import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectRowProps {
  label: string
  /** Small muted text shown after the label (e.g. "2×/mo") */
  sublabel?: string
  value: string
  /** Override the SelectValue trigger text when the stored value key ≠ display label */
  displayValue?: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
  /** Width of the select trigger. Defaults to 'w-44'. */
  width?: 'w-44' | 'w-52'
  /** When true, grays out the row and shows an N/A placeholder instead of a Select. */
  disabled?: boolean
}

export default function SelectRow({
  label,
  sublabel,
  value,
  displayValue,
  onValueChange,
  options,
  width = 'w-44',
  disabled = false,
}: SelectRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded border p-2${disabled ? ' opacity-50' : ''}`}
    >
      <div className="min-w-0">
        <span className="text-sm font-medium">{label}</span>
        {sublabel && <span className="ml-1.5 text-xs text-muted-foreground">{sublabel}</span>}
      </div>

      {disabled ? (
        <div
          className={`${width} h-8 rounded border border-input bg-muted/30 px-3 flex items-center text-xs text-muted-foreground`}
        >
          N/A
        </div>
      ) : (
        <Select value={value} onValueChange={(v) => v && onValueChange(v)}>
          <SelectTrigger className={`${width} h-8 text-xs`}>
            {displayValue !== undefined ? (
              <SelectValue>{displayValue}</SelectValue>
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
