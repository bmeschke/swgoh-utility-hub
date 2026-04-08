import { type PassesInputs } from '@/lib/income'

interface Props {
  inputs: PassesInputs
  onChange: (inputs: PassesInputs) => void
}

const PASSES: { key: keyof PassesInputs; label: string }[] = [
  { key: 'episodePass', label: 'Premium Episode Pass' },
  { key: 'conquestPass', label: 'Premium Conquest Pass' },
]

export default function PassesSection({ inputs, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select any passes you purchase. Reward data pending — totals will update once added.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PASSES.map(({ key, label }) => (
          <label
            key={key}
            htmlFor={`pass-${key}`}
            className="flex items-center justify-between gap-3 rounded border p-2 cursor-pointer"
          >
            <span className="text-sm font-medium">{label}</span>
            <input
              id={`pass-${key}`}
              type="checkbox"
              checked={inputs[key]}
              onChange={(e) => onChange({ ...inputs, [key]: e.target.checked })}
              className="size-4 cursor-pointer accent-primary"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
