import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { XIcon } from 'lucide-react'
import { type SabTierDraft, type SabDiscount } from '@/lib/valuations'
import ItemCombobox, { type ItemComboboxHandle } from './ItemCombobox'
import type { Doc } from '../../../convex/_generated/dataModel'

interface SabPackBuilderProps {
  tiers: SabTierDraft[]
  discounts: SabDiscount[]
  onChange: (tiers: SabTierDraft[], discounts: SabDiscount[]) => void
}

const TIER_LABELS = ['Tier 1', 'Tier 2', 'Tier 3']

export default function SabPackBuilder({ tiers, discounts, onChange }: SabPackBuilderProps) {
  function updateTierPrice(tierIdx: number, value: string) {
    onChange(tiers.map((t, i) => i === tierIdx ? { ...t, price: value } : t), discounts)
  }

  function addItem(tierIdx: number, item: Doc<'items'>) {
    if (tiers[tierIdx].items.some((li) => li.itemId === item._id)) return
    onChange(
      tiers.map((t, i) => i !== tierIdx ? t : {
        ...t,
        items: [...t.items, { itemId: item._id, name: item.name, crystalValue: item.crystalValue, quantity: 1 }],
      }),
      discounts
    )
  }

  function updateQty(tierIdx: number, itemIdx: number, qty: number) {
    onChange(
      tiers.map((t, i) => i !== tierIdx ? t : {
        ...t,
        items: t.items.map((li, j) => j === itemIdx ? { ...li, quantity: qty } : li),
      }),
      discounts
    )
  }

  function removeItem(tierIdx: number, itemIdx: number) {
    onChange(
      tiers.map((t, i) => i !== tierIdx ? t : {
        ...t,
        items: t.items.filter((_, j) => j !== itemIdx),
      }),
      discounts
    )
  }

  function updateDiscount(discountIdx: number, value: string) {
    onChange(tiers, discounts.map((d, i) => i === discountIdx ? { ...d, discountAmount: value } : d))
  }

  return (
    <div className="space-y-6">

      {/* Volume discounts */}
      <div className="space-y-2">
        <Label className="text-sm">Volume discounts <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
        <p className="text-xs text-muted-foreground">
          Enter the discount amount shown in-game. The effective price per purchase will be calculated automatically.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {discounts.map((d, i) => {
            const tierPrices = tiers.slice(0, i + 1).map(t => parseFloat(t.price) || 0)
            const allTiersFilled = tierPrices.every(p => p > 0)
            const cumulativePrice = tierPrices.reduce((s, p) => s + p, 0)
            const discountAmt = parseFloat(d.discountAmount) || 0
            const effectiveTotal = cumulativePrice - discountAmt
            return (
              <div key={i} className="rounded border p-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Buy {d.quantity} Discount</p>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={d.discountAmount}
                    onChange={(e) => updateDiscount(i, e.target.value)}
                    className="h-7 text-xs pl-5"
                  />
                </div>
                {allTiersFilled && discountAmt > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ${effectiveTotal.toFixed(2)} total
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tier panels */}
      {tiers.map((tier, tierIdx) => (
        <TierPanel
          key={tierIdx}
          tier={tier}
          label={TIER_LABELS[tierIdx]}
          onPriceChange={(v) => updateTierPrice(tierIdx, v)}
          onAddItem={(item) => addItem(tierIdx, item)}
          onUpdateQty={(itemIdx, qty) => updateQty(tierIdx, itemIdx, qty)}
          onRemoveItem={(itemIdx) => removeItem(tierIdx, itemIdx)}
        />
      ))}

    </div>
  )
}

// ─── Tier panel sub-component ──────────────────────────────────────────────────

interface TierPanelProps {
  tier: SabTierDraft
  label: string
  onPriceChange: (value: string) => void
  onAddItem: (item: Doc<'items'>) => void
  onUpdateQty: (itemIdx: number, qty: number) => void
  onRemoveItem: (itemIdx: number) => void
}

function TierPanel({ tier, label, onPriceChange, onAddItem, onUpdateQty, onRemoveItem }: TierPanelProps) {
  const comboboxRef = useRef<ItemComboboxHandle>(null)
  const qtyRefs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocusIndex = useRef<number | null>(null)

  useEffect(() => {
    if (pendingFocusIndex.current !== null) {
      const idx = pendingFocusIndex.current
      pendingFocusIndex.current = null
      const input = qtyRefs.current[idx]
      if (input) { input.focus(); input.select() }
    }
  }, [tier.items.length])

  function handleAddItem(item: Doc<'items'>) {
    pendingFocusIndex.current = tier.items.length
    onAddItem(item)
  }

  return (
    <div className="rounded-lg border bg-muted/10 overflow-hidden">
      {/* Tier header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/20">
        <span className="text-sm font-semibold w-14 shrink-0">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Price</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={tier.price}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-24 h-7 text-xs pl-5"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-3 space-y-1.5">
        {tier.items.map((item, itemIdx) => (
          <div key={itemIdx} className="rounded border bg-muted/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
            <Input
              type="number"
              min={1}
              step="any"
              value={item.quantity}
              ref={(el) => { qtyRefs.current[itemIdx] = el }}
              onChange={(e) => {
                const v = parseFloat(e.target.value)
                if (!isNaN(v) && v > 0) onUpdateQty(itemIdx, v)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  e.preventDefault()
                  comboboxRef.current?.openAndFocus()
                }
              }}
              className="w-20 h-6 text-xs text-center px-1 shrink-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemoveItem(itemIdx)}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <XIcon className="size-3" />
            </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.crystalValue}✦ × {item.quantity} = {(item.crystalValue * item.quantity).toLocaleString()}✦
            </p>
          </div>
        ))}

        <ItemCombobox
          ref={comboboxRef}
          onAdd={handleAddItem}
          placeholder="Add item..."
          compact
        />
      </div>
    </div>
  )
}
