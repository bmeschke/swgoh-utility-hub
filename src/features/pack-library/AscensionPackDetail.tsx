import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
} from '@/lib/valuations'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AscensionItemDetail {
  itemId: string
  quantity: number
  name: string
  category?: string
  crystalValue: number
}

interface AscensionTierDetail {
  price: number
  crystalEquivalent: number
  items: AscensionItemDetail[]
}

interface AscensionPackDetailProps {
  pack: {
    name: string
    notes?: string
    ascensionTiersWithDetails?: AscensionTierDetail[]
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simple cumulative price for tiers 0..upToIndex (no discounts) */
function ascensionCumulativePrice(tiers: AscensionTierDetail[], upToIndex: number): number {
  return tiers.slice(0, upToIndex + 1).reduce((s, t) => s + t.price, 0)
}

/** Incremental price for tier at index */
function incrementalPrice(tiers: AscensionTierDetail[], tierIdx: number): number {
  const cumulative = ascensionCumulativePrice(tiers, tierIdx)
  const prev = tierIdx > 0 ? ascensionCumulativePrice(tiers, tierIdx - 1) : 0
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function AscensionPackDetail({ pack }: AscensionPackDetailProps) {
  const tiers = pack.ascensionTiersWithDetails ?? []

  // The "stopping tier" index — user's selection of how many tiers to buy.
  // null = nothing selected. Clicking the same tier again deselects.
  const [stoppingTierIdx, setStoppingTierIdx] = useState<number | null>(null)

  function handleTierClick(tierIdx: number) {
    setStoppingTierIdx((prev) => (prev === tierIdx ? null : tierIdx))
  }

  // Tiers included in the purchase: 0..stoppingTierIdx
  const includedCount = stoppingTierIdx !== null ? stoppingTierIdx + 1 : 0

  // Cumulative CE for selected tiers
  const totalCE = tiers.slice(0, includedCount).reduce((s, t) => s + t.crystalEquivalent, 0)

  const totalPaid = stoppingTierIdx !== null ? ascensionCumulativePrice(tiers, stoppingTierIdx) : 0

  const standardValue = calcDollarValue(totalCE, 'regular')
  const holidayValue = calcDollarValue(totalCE, 'holiday')
  const regularPct = calcGainLossPercent(standardValue, totalPaid)
  const holidayPct = calcGainLossPercent(holidayValue, totalPaid)

  if (tiers.length === 0) {
    return <p className="text-sm text-muted-foreground">No tier data available.</p>
  }

  return (
    <div className="space-y-4">
      {/* ── Tier panels ── */}
      {tiers.map((tier, tierIdx) => {
        const isIncluded = stoppingTierIdx !== null && tierIdx <= stoppingTierIdx
        const isDimmed = stoppingTierIdx !== null && tierIdx > stoppingTierIdx
        const incPrice = incrementalPrice(tiers, tierIdx)

        return (
          <div
            key={tierIdx}
            onClick={() => handleTierClick(tierIdx)}
            className={cn(
              'rounded-lg border transition-all cursor-pointer',
              isDimmed ? 'opacity-50' : '',
              isIncluded ? 'border-primary/60 bg-primary/5' : 'bg-muted/10 hover:bg-muted/20'
            )}
          >
            {/* Tier header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-inherit">
              <span className="text-sm font-semibold">Tier {tierIdx + 1}</span>
              {incPrice > 0 && (
                <span className="text-sm text-muted-foreground">+${incPrice.toFixed(2)}</span>
              )}
              {/* Tier-level valuation badges */}
              {incPrice > 0 &&
                tier.crystalEquivalent > 0 &&
                (() => {
                  const tierStdVal = calcDollarValue(tier.crystalEquivalent, 'regular')
                  const tierHolVal = calcDollarValue(tier.crystalEquivalent, 'holiday')
                  const tierStdPct = calcGainLossPercent(tierStdVal, incPrice)
                  const tierHolPct = calcGainLossPercent(tierHolVal, incPrice)
                  return (
                    <span className="flex items-center gap-1">
                      <GainBadge pct={tierStdPct} />
                      <GainBadge pct={tierStdPct} displayPct={tierHolPct} />
                    </span>
                  )
                })()}
              <span className="ml-auto text-xs">
                {isIncluded ? (
                  <span className="text-primary font-medium">Included ✓</span>
                ) : (
                  <span className="text-muted-foreground">
                    {tier.crystalEquivalent > 0
                      ? `${Math.round(tier.crystalEquivalent).toLocaleString()}✦`
                      : 'Click to include'}
                  </span>
                )}
              </span>
            </div>

            {/* Item rows — all items are received (no choice) */}
            <div className="divide-y divide-border/50">
              {tier.items.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground italic">No items recorded.</p>
              ) : (
                tier.items.map((item) => {
                  const itemCE = item.crystalValue * item.quantity
                  const itemStdVal = calcDollarValue(itemCE, 'regular')
                  const itemHolVal = calcDollarValue(itemCE, 'holiday')

                  return (
                    <div key={item.itemId} className="px-4 py-2.5">
                      {/* Row 1: name + standard value */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          Standard: ${itemStdVal.toFixed(2)}
                        </span>
                      </div>
                      {/* Row 2: CV formula + holiday value */}
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {item.crystalValue.toLocaleString()}✦ × {item.quantity.toLocaleString()} ={' '}
                          {itemCE.toLocaleString()}✦
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          Holiday: ${itemHolVal.toFixed(2)}
                        </span>
                      </div>
                    </div>
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
          {stoppingTierIdx === null ? (
            <p className="text-muted-foreground text-sm">
              Click a tier above to see the value of buying through that tier.
            </p>
          ) : (
            <>
              {tiers.slice(0, includedCount).map((tier, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Tier {i + 1}</span>
                    <span>{Math.round(tier.crystalEquivalent).toLocaleString()}✦</span>
                  </div>
                  {tier.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex justify-between text-xs text-muted-foreground pl-2"
                    >
                      <span>{item.name}</span>
                      <span>
                        {item.crystalValue.toLocaleString()}✦ × {item.quantity.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Valuation ── */}
      {stoppingTierIdx !== null && totalCE > 0 && totalPaid > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content crystal value</span>
              <span className="font-medium">{totalCE.toLocaleString()}✦</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bundle price</span>
              <span className="font-medium">${totalPaid.toFixed(2)}</span>
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

      {/* ── Tier Breakdown ── */}
      {tiers.some((t) => t.crystalEquivalent > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Tier Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {/* Per-tier breakdown — only when 2+ tiers */}
            {tiers.length > 1 && (
              <>
                {tiers.map((tier, tierIdx) => {
                  const tierCE = tier.crystalEquivalent
                  if (tierCE <= 0) return null
                  const incPrice = incrementalPrice(tiers, tierIdx)
                  const tierStdVal = calcDollarValue(tierCE, 'regular')
                  const tierHolVal = calcDollarValue(tierCE, 'holiday')
                  const tierStdPct = calcGainLossPercent(tierStdVal, incPrice)
                  const tierHolPct = calcGainLossPercent(tierHolVal, incPrice)
                  return (
                    <div key={tierIdx} className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Tier {tierIdx + 1}
                        {incPrice > 0 ? ` — $${incPrice.toFixed(2)}` : ''}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Content crystal value</span>
                        <span className="font-medium">{Math.round(tierCE).toLocaleString()}✦</span>
                      </div>
                      {incPrice > 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Regular pricing</span>
                            <span className="flex items-center gap-2">
                              ${tierStdVal.toFixed(2)}
                              <GainBadge pct={tierStdPct} />
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Holiday pricing</span>
                            <span className="flex items-center gap-2">
                              ${tierHolVal.toFixed(2)}
                              <GainBadge pct={tierStdPct} displayPct={tierHolPct} />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
