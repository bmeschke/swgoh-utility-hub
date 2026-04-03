import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon, PlusIcon } from 'lucide-react'
import { type AscensionTierDraft, calcAscensionTierCE } from '@/lib/valuations'
import ItemCombobox, { type ItemComboboxHandle } from './ItemCombobox'
import type { Doc } from '../../../convex/_generated/dataModel'

interface AscensionPackBuilderProps {
  tiers: AscensionTierDraft[]
  onChange: (tiers: AscensionTierDraft[]) => void
}

export default function AscensionPackBuilder({ tiers, onChange }: AscensionPackBuilderProps) {
  function updateTierPrice(tierIdx: number, value: string) {
    onChange(tiers.map((t, i) => (i === tierIdx ? { ...t, price: value } : t)))
  }

  function addItem(tierIdx: number, item: Doc<'items'>) {
    if (tiers[tierIdx].items.some((li) => li.itemId === item._id)) return
    onChange(
      tiers.map((t, i) =>
        i !== tierIdx
          ? t
          : {
              ...t,
              items: [
                ...t.items,
                { itemId: item._id, name: item.name, crystalValue: item.crystalValue, quantity: 1 },
              ],
            }
      )
    )
  }

  function updateQty(tierIdx: number, itemIdx: number, qty: number) {
    onChange(
      tiers.map((t, i) =>
        i !== tierIdx
          ? t
          : {
              ...t,
              items: t.items.map((li, j) => (j === itemIdx ? { ...li, quantity: qty } : li)),
            }
      )
    )
  }

  function removeItem(tierIdx: number, itemIdx: number) {
    onChange(
      tiers.map((t, i) =>
        i !== tierIdx
          ? t
          : {
              ...t,
              items: t.items.filter((_, j) => j !== itemIdx),
            }
      )
    )
  }

  function addTier() {
    onChange([...tiers, { price: '', items: [] }])
  }

  function removeTier(tierIdx: number) {
    if (tiers.length <= 4) return
    onChange(tiers.filter((_, i) => i !== tierIdx))
  }

  return (
    <div className="space-y-6">
      {/* Tier panels */}
      {tiers.map((tier, tierIdx) => (
        <TierPanel
          key={tierIdx}
          tier={tier}
          label={`Tier ${tierIdx + 1}`}
          canRemove={tiers.length > 4}
          onPriceChange={(v) => updateTierPrice(tierIdx, v)}
          onAddItem={(item) => addItem(tierIdx, item)}
          onUpdateQty={(itemIdx, qty) => updateQty(tierIdx, itemIdx, qty)}
          onRemoveItem={(itemIdx) => removeItem(tierIdx, itemIdx)}
          onRemoveTier={() => removeTier(tierIdx)}
        />
      ))}

      {/* Add tier button */}
      <Button type="button" variant="outline" size="sm" onClick={addTier} className="w-full">
        <PlusIcon className="size-3.5 mr-1.5" />
        Add Tier
      </Button>
    </div>
  )
}

// ─── Tier panel sub-component ──────────────────────────────────────────────────

interface TierPanelProps {
  tier: AscensionTierDraft
  label: string
  canRemove: boolean
  onPriceChange: (value: string) => void
  onAddItem: (item: Doc<'items'>) => void
  onUpdateQty: (itemIdx: number, qty: number) => void
  onRemoveItem: (itemIdx: number) => void
  onRemoveTier: () => void
}

function TierPanel({
  tier,
  label,
  canRemove,
  onPriceChange,
  onAddItem,
  onUpdateQty,
  onRemoveItem,
  onRemoveTier,
}: TierPanelProps) {
  const comboboxRef = useRef<ItemComboboxHandle>(null)
  const qtyRefs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocusIndex = useRef<number | null>(null)

  const tierCE = calcAscensionTierCE(tier)

  useEffect(() => {
    if (pendingFocusIndex.current !== null) {
      const idx = pendingFocusIndex.current
      pendingFocusIndex.current = null
      const input = qtyRefs.current[idx]
      if (input) {
        input.focus()
        input.select()
      }
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
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
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
        {tierCE > 0 && (
          <span className="text-xs text-muted-foreground ml-1">
            {Math.round(tierCE).toLocaleString()}✦ content
          </span>
        )}
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemoveTier}
            className="ml-auto text-muted-foreground hover:text-destructive"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
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
                ref={(el) => {
                  qtyRefs.current[itemIdx] = el
                }}
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
              {item.crystalValue}✦ × {item.quantity} ={' '}
              {(item.crystalValue * item.quantity).toLocaleString()}✦
            </p>
          </div>
        ))}

        <ItemCombobox ref={comboboxRef} onAdd={handleAddItem} placeholder="Add item..." compact />
      </div>
    </div>
  )
}
