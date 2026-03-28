import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LockIcon, CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
} from '@/lib/valuations'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SabItemDetail {
  itemId: string
  quantity: number
  name: string
  category?: string
  crystalValue: number
}

interface SabTierDetail {
  price: number
  crystalEquivalent: number
  items: SabItemDetail[]
}

interface SabDiscount {
  quantity: number
  discountAmount: number
}

interface SabPackDetailProps {
  pack: {
    name: string
    notes?: string
    sabTiersWithDetails?: SabTierDetail[]
    sabDiscounts?: SabDiscount[]
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Cumulative discounted price for tiers 0..upToIndex */
function cumulativeEffectivePrice(
  tiers: SabTierDetail[],
  discounts: SabDiscount[] | undefined,
  upToIndex: number
): number {
  const raw = tiers.slice(0, upToIndex + 1).reduce((s, t) => s + t.price, 0)
  const discount = discounts?.[upToIndex]?.discountAmount ?? 0
  return raw - discount
}

/** Incremental effective price for tier at index (what you actually pay for that tier) */
function incrementalEffectivePrice(
  tiers: SabTierDetail[],
  discounts: SabDiscount[] | undefined,
  tierIdx: number
): number {
  const cumulative = cumulativeEffectivePrice(tiers, discounts, tierIdx)
  const prev = tierIdx > 0 ? cumulativeEffectivePrice(tiers, discounts, tierIdx - 1) : 0
  return cumulative - prev
}

function GainBadge({ pct, displayPct }: { pct: number; displayPct?: number }) {
  const label = getRecommendationLabel(pct)
  const shown = displayPct ?? pct
  const sign = shown >= 0 ? '+' : ''
  return (
    <Badge className={`text-xs border ${getValueBadgeClass(pct)}`}>
      {sign}
      {shown.toFixed(1)}% — {label}
    </Badge>
  )
}

const TIER_LABELS = ['Tier 1', 'Tier 2', 'Tier 3']

// ─── Component ────────────────────────────────────────────────────────────────

export default function SabPackDetail({ pack }: SabPackDetailProps) {
  const tiers = pack.sabTiersWithDetails ?? []
  const discounts = pack.sabDiscounts

  // One selected itemId per tier (null = nothing selected)
  const [selectedItemIds, setSelectedItemIds] = useState<(string | null)[]>(() =>
    tiers.map(() => null)
  )

  // A tier is unlocked only if all previous tiers have a selection
  function isTierLocked(tierIdx: number): boolean {
    if (tierIdx === 0) return false
    return selectedItemIds[tierIdx - 1] === null
  }

  function selectItem(tierIdx: number, itemId: string) {
    const next = [...selectedItemIds]
    if (next[tierIdx] === itemId) {
      // Deselecting — clear this tier and all subsequent tiers
      for (let i = tierIdx; i < next.length; i++) next[i] = null
    } else {
      // Changing selection — only update this tier, leave others intact
      next[tierIdx] = itemId
    }
    setSelectedItemIds(next)
  }

  // Number of consecutive tiers with a selection (from the start)
  const tiersCount =
    selectedItemIds.findIndex((id) => id === null) === -1
      ? tiers.length
      : selectedItemIds.findIndex((id) => id === null)

  // Resolve selected item details per tier
  const selectedItems = tiers.map((tier, i) => {
    if (!selectedItemIds[i]) return null
    return tier.items.find((item) => item.itemId === selectedItemIds[i]) ?? null
  })

  const totalCE = selectedItems.reduce(
    (s, item) => s + (item ? item.crystalValue * item.quantity : 0),
    0
  )
  const totalPaid = tiersCount > 0 ? cumulativeEffectivePrice(tiers, discounts, tiersCount - 1) : 0

  const standardValue = calcDollarValue(totalCE, 'regular')
  const holidayValue = calcDollarValue(totalCE, 'holiday')
  const regularPct = calcGainLossPercent(standardValue, totalPaid)
  const holidayPct = calcGainLossPercent(holidayValue, totalPaid)

  const hasAnySelection = selectedItemIds.some((id) => id !== null)

  // ── Average value (always computed, shown regardless of selection) ──────────
  const totalAvgCE = tiers.reduce((s, t) => s + t.crystalEquivalent, 0)
  const avgTotalPrice =
    tiers.length > 0 ? cumulativeEffectivePrice(tiers, discounts, tiers.length - 1) : 0
  const avgTotalStdVal = calcDollarValue(totalAvgCE, 'regular')
  const avgTotalHolVal = calcDollarValue(totalAvgCE, 'holiday')
  const avgTotalStdPct = calcGainLossPercent(avgTotalStdVal, avgTotalPrice)
  const avgTotalHolPct = calcGainLossPercent(avgTotalHolVal, avgTotalPrice)

  if (tiers.length === 0) {
    return <p className="text-sm text-muted-foreground">No tier data available.</p>
  }

  return (
    <div className="space-y-4">
      {/* ── Tier panels ── */}
      {tiers.map((tier, tierIdx) => {
        const locked = isTierLocked(tierIdx)
        const tierHasSelection = selectedItemIds[tierIdx] !== null
        const incPrice = incrementalEffectivePrice(tiers, discounts, tierIdx)

        return (
          <div
            key={tierIdx}
            className={cn(
              'rounded-lg border transition-all',
              locked ? 'opacity-50' : '',
              tierHasSelection ? 'border-primary/60 bg-primary/5' : 'bg-muted/10'
            )}
          >
            {/* Tier header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-inherit">
              {locked && <LockIcon className="size-3.5 text-muted-foreground shrink-0" />}
              <span className="text-sm font-semibold">{TIER_LABELS[tierIdx]}</span>
              {incPrice > 0 && (
                <span className="text-sm text-muted-foreground">+${incPrice.toFixed(2)}</span>
              )}
              <span className="ml-auto text-xs">
                {tierHasSelection ? (
                  <span className="text-primary font-medium">Selected ✓</span>
                ) : locked ? (
                  <span className="text-muted-foreground">Select Tier {tierIdx} first</span>
                ) : (
                  <span className="text-muted-foreground">Choose one below</span>
                )}
              </span>
            </div>

            {/* Item rows */}
            <div className="divide-y divide-border/50">
              {tier.items.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground italic">No items recorded.</p>
              ) : (
                tier.items.map((item) => {
                  const isSelected = selectedItemIds[tierIdx] === item.itemId
                  const itemCE = item.crystalValue * item.quantity
                  const itemStdVal = calcDollarValue(itemCE, 'regular')
                  const itemHolVal = calcDollarValue(itemCE, 'holiday')
                  const itemStdPct = calcGainLossPercent(itemStdVal, incPrice)
                  const itemHolPct = calcGainLossPercent(itemHolVal, incPrice)

                  return (
                    <button
                      key={item.itemId}
                      type="button"
                      disabled={locked}
                      onClick={() => selectItem(tierIdx, item.itemId)}
                      className={cn(
                        'w-full text-left px-4 py-2.5 transition-colors',
                        locked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted/30',
                        isSelected ? 'bg-primary/10' : ''
                      )}
                    >
                      {/* Row 1: name + standard value */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          {isSelected && <CheckIcon className="size-3.5 text-primary shrink-0" />}
                          {item.name}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            Standard: ${itemStdVal.toFixed(2)}
                          </span>
                          {incPrice > 0 && <GainBadge pct={itemStdPct} />}
                        </span>
                      </div>
                      {/* Row 2: CV formula + holiday value */}
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {item.crystalValue.toLocaleString()}✦ × {item.quantity.toLocaleString()} ={' '}
                          {itemCE.toLocaleString()}✦
                        </span>
                        {incPrice > 0 && (
                          <span className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              Holiday: ${itemHolVal.toFixed(2)}
                            </span>
                            <GainBadge pct={itemStdPct} displayPct={itemHolPct} />
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}

      {/* ── Your Selection ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Your Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!hasAnySelection ? (
            <p className="text-muted-foreground text-sm">
              Choose one item from each tier above to see your total value.
            </p>
          ) : (
            <>
              {selectedItems.map((item, i) =>
                item ? (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{TIER_LABELS[i]}</span>
                      <span>{(item.crystalValue * item.quantity).toLocaleString()}✦</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pl-2">
                      <span>{item.name}</span>
                      <span>
                        {item.crystalValue.toLocaleString()}✦ × {item.quantity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : null
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Valuation ── */}
      {hasAnySelection && totalCE > 0 && totalPaid > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bundle price</span>
              <span className="font-medium">${totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content crystal value</span>
              <span className="font-medium">{totalCE.toLocaleString()}✦</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expected standard price</span>
              <span className="flex items-center gap-2">
                ${standardValue.toFixed(2)}
                <GainBadge pct={regularPct} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expected holiday price</span>
              <span className="flex items-center gap-2">
                ${holidayValue.toFixed(2)}
                <GainBadge pct={regularPct} displayPct={holidayPct} />
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Average Value ── */}
      {totalAvgCE > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Average Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {/* Per-tier breakdown — only when 2+ tiers */}
            {tiers.length > 1 && (
              <>
                {tiers.map((tier, tierIdx) => {
                  const avgCE = tier.crystalEquivalent
                  if (avgCE <= 0) return null
                  const incPrice = incrementalEffectivePrice(tiers, discounts, tierIdx)
                  const avgStdVal = calcDollarValue(avgCE, 'regular')
                  const avgHolVal = calcDollarValue(avgCE, 'holiday')
                  const avgStdPct = calcGainLossPercent(avgStdVal, incPrice)
                  const avgHolPct = calcGainLossPercent(avgHolVal, incPrice)
                  return (
                    <div key={tierIdx} className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        {TIER_LABELS[tierIdx]}
                        {incPrice > 0 ? ` — $${incPrice.toFixed(2)}` : ''}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Content avg crystal value</span>
                        <span className="font-medium">{Math.round(avgCE).toLocaleString()}✦</span>
                      </div>
                      {incPrice > 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Regular pricing</span>
                            <span className="flex items-center gap-2">
                              ${avgStdVal.toFixed(2)}
                              <GainBadge pct={avgStdPct} />
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Holiday pricing</span>
                            <span className="flex items-center gap-2">
                              ${avgHolVal.toFixed(2)}
                              <GainBadge pct={avgStdPct} displayPct={avgHolPct} />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
                <Separator />
              </>
            )}

            {/* Totals */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content avg crystal value</span>
              <span className="font-medium">{Math.round(totalAvgCE).toLocaleString()}✦</span>
            </div>
            {avgTotalPrice > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bundle price</span>
                  <span className="font-medium">${avgTotalPrice.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Regular pricing</span>
                  <span className="flex items-center gap-2">
                    ${avgTotalStdVal.toFixed(2)}
                    <GainBadge pct={avgTotalStdPct} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Holiday pricing</span>
                  <span className="flex items-center gap-2">
                    ${avgTotalHolVal.toFixed(2)}
                    <GainBadge pct={avgTotalStdPct} displayPct={avgTotalHolPct} />
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
