import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon, Dices, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProbabilityTier } from '@/lib/valuations'

interface LocalTier {
  probability: string
  quantity: string
}

interface PackLineItemProps {
  name: string
  crystalValue: number
  quantity: number
  tiers?: ProbabilityTier[]
  onQuantityChange: (qty: number) => void
  onTiersChange: (tiers: ProbabilityTier[] | undefined) => void
  onRemove: () => void
  inputRef?: (el: HTMLInputElement | null) => void
  rowRef?: (el: HTMLDivElement | null) => void
  onEnter?: () => void
}

function toLocalTiers(tiers: ProbabilityTier[]): LocalTier[] {
  return tiers.map((t) => ({ probability: String(t.probability), quantity: String(t.quantity) }))
}

function calcEV(localTiers: LocalTier[]): number {
  return localTiers.reduce((sum, t) => {
    const p = parseFloat(t.probability)
    const q = parseFloat(t.quantity)
    return sum + (isNaN(p) || isNaN(q) ? 0 : (p / 100) * q)
  }, 0)
}

function totalProb(localTiers: LocalTier[]): number {
  return localTiers.reduce((sum, t) => {
    const p = parseFloat(t.probability)
    return sum + (isNaN(p) ? 0 : p)
  }, 0)
}

export default function PackLineItem({
  name,
  crystalValue,
  quantity,
  tiers,
  onQuantityChange,
  onTiersChange,
  onRemove,
  inputRef,
  rowRef,
  onEnter,
}: PackLineItemProps) {
  const hasPropTiers = tiers && tiers.length > 0
  const [tiersActive, setTiersActive] = useState(hasPropTiers ?? false)
  const [localTiers, setLocalTiers] = useState<LocalTier[]>(
    hasPropTiers ? toLocalTiers(tiers!) : []
  )
  const [localValue, setLocalValue] = useState(quantity > 0 && !hasPropTiers ? String(quantity) : '')
  const prevQuantityRef = useRef(quantity)
  const tierProbRefs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocusTierIndex = useRef<number | null>(null)

  // Focus a tier's probability input after it's been added to the DOM
  useEffect(() => {
    if (pendingFocusTierIndex.current !== null) {
      const idx = pendingFocusTierIndex.current
      pendingFocusTierIndex.current = null
      tierProbRefs.current[idx]?.focus()
    }
  }, [localTiers.length])

  // Sync external quantity changes when NOT in tier mode
  useEffect(() => {
    if (!tiersActive && quantity !== prevQuantityRef.current) {
      setLocalValue(String(quantity))
      prevQuantityRef.current = quantity
    }
  }, [quantity, tiersActive])

  const ev = tiersActive ? calcEV(localTiers) : quantity
  const subtotal = crystalValue * ev
  const probTotal = tiersActive ? totalProb(localTiers) : 0
  const probOk = Math.abs(probTotal - 100) < 0.01

  function handleManualChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setLocalValue(raw)
    const val = parseFloat(raw)
    if (!isNaN(val) && val > 0) onQuantityChange(val)
  }

  function handleManualBlur() {
    const val = parseFloat(localValue)
    if (isNaN(val) || val <= 0) {
      if (quantity > 0) setLocalValue(String(quantity))
    }
  }

  function handleManualKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const val = parseFloat(localValue)
      if (isNaN(val) || val <= 0) { setLocalValue('1'); onQuantityChange(1) }
      onEnter?.()
    }
  }

  function toggleTiers() {
    if (tiersActive) {
      setTiersActive(false)
      setLocalTiers([])
      setLocalValue('')
      onTiersChange(undefined)
    } else {
      setTiersActive(true)
      setLocalTiers([{ probability: '', quantity: '' }])
      pendingFocusTierIndex.current = 0 // focus first tier's prob input after render
      onTiersChange(undefined)
    }
  }

  function commitTiers(next: LocalTier[]) {
    const ev = calcEV(next)
    onQuantityChange(ev)
    const valid = next.flatMap((t) => {
      const p = parseFloat(t.probability)
      const q = parseFloat(t.quantity)
      return isNaN(p) || isNaN(q) ? [] : [{ probability: p, quantity: q }]
    })
    onTiersChange(valid.length > 0 ? valid : undefined)
  }

  function updateTier(index: number, field: 'probability' | 'quantity', value: string) {
    const next = localTiers.map((t, i) => i === index ? { ...t, [field]: value } : t)
    setLocalTiers(next)
    commitTiers(next)
  }

  function addTier(focusIndex: number) {
    setLocalTiers((prev) => [...prev, { probability: '', quantity: '' }])
    pendingFocusTierIndex.current = focusIndex
  }

  function removeTier(index: number) {
    const next = localTiers.filter((_, i) => i !== index)
    tierProbRefs.current.splice(index, 1)
    setLocalTiers(next)
    commitTiers(next)
  }

  return (
    <div ref={rowRef} className="rounded-lg border bg-muted/20">
      {/* Main row */}
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground">
            {tiersActive
              ? `EV: ~${ev.toFixed(2)}×${crystalValue.toLocaleString()}✦ = ~${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}✦`
              : `${crystalValue}✦ × ${quantity} = ${subtotal.toLocaleString()}✦`}
          </p>
        </div>

        {tiersActive ? (
          <span className="w-24 text-center text-sm text-muted-foreground shrink-0">
            ~{ev.toFixed(2)}
          </span>
        ) : (
          <Input
            ref={inputRef}
            type="number"
            min={0}
            step="any"
            value={localValue}
            onChange={handleManualChange}
            onBlur={handleManualBlur}
            onKeyDown={handleManualKeyDown}
            className="w-24 h-6 text-center text-sm px-1 shrink-0"
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={toggleTiers}
          className={cn(
            'shrink-0',
            tiersActive
              ? 'text-primary bg-primary/10 hover:bg-primary/20'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title="Set probabilities"
        >
          <Dices className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0"
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>

      {/* Tier panel */}
      {tiersActive && (
        <div className="border-t px-3 py-2 space-y-1.5">
          {localTiers.map((tier, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Input
                ref={(el) => { tierProbRefs.current[i] = el }}
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="0"
                value={tier.probability}
                onChange={(e) => updateTier(i, 'probability', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    // natural tab to qty input — no override needed
                  }
                }}
                className="w-16 h-6 text-center text-xs px-1"
              />
              <span className="text-xs text-muted-foreground">%  ×</span>
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="qty"
                value={tier.quantity}
                onChange={(e) => updateTier(i, 'quantity', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTier(localTiers.length) // focus the new tier's prob input
                  }
                }}
                className="w-20 h-6 text-center text-xs px-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeTier(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addTier(localTiers.length)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <PlusIcon className="size-3 mr-1" />
              Add tier
            </Button>
            <span className={cn(
              'text-xs',
              probOk ? 'text-green-400' : probTotal > 0 ? 'text-yellow-400' : 'text-muted-foreground'
            )}>
              {probTotal.toFixed(probTotal % 1 === 0 ? 0 : 1)}% {probOk ? '✓' : '⚠'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
