import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  type PriceCurrency,
  type SabTierDraft,
  type SabDiscount,
  calcSabTierCE,
} from '@/lib/valuations'
import SaveToLibraryDialog from './SaveToLibraryDialog'
import type { EvalLineItem } from './EvaluatePackForm'
import type { PackType } from './EvaluatePackForm'

interface PackValueResultProps {
  packType: PackType
  crystalEquivalent: number
  price: number
  priceCurrency: PriceCurrency
  items: EvalLineItem[]
  sabTiers?: SabTierDraft[]
  sabDiscounts?: SabDiscount[]
}

function GainBadge({ pct, displayPct }: { pct: number; displayPct?: number }) {
  const label = getRecommendationLabel(pct)
  const shown = displayPct ?? pct
  const sign = shown >= 0 ? '+' : ''
  const variant = pct > 5 ? 'default' : pct >= -5 ? 'secondary' : 'destructive'
  return (
    <Badge variant={variant} className="ml-2 text-xs">
      {sign}{shown.toFixed(1)}% — {label}
    </Badge>
  )
}

/** Compute the effective cumulative price for tiers 0..i (sum minus the matching discount) */
function cumulativeEffectivePrice(
  sabTiers: SabTierDraft[],
  sabDiscounts: SabDiscount[] | undefined,
  upToIndex: number,
): number {
  const raw = sabTiers.slice(0, upToIndex + 1).reduce((s, t) => s + (parseFloat(t.price) || 0), 0)
  const discount = sabDiscounts ? parseFloat(sabDiscounts[upToIndex]?.discountAmount ?? '') || 0 : 0
  return raw - discount
}

export default function PackValueResult({
  packType,
  crystalEquivalent,
  price,
  priceCurrency,
  items,
  sabTiers,
  sabDiscounts,
}: PackValueResultProps) {
  const { user } = useUser()
  const isAdmin = !!import.meta.env.VITE_ADMIN_USER_ID && user?.id === import.meta.env.VITE_ADMIN_USER_ID
  const [dialogOpen, setDialogOpen] = useState(false)

  const isCrystalPack = priceCurrency === 'crystals'
  const regularValue = calcDollarValue(crystalEquivalent, 'regular')
  const holidayValue = calcDollarValue(crystalEquivalent, 'holiday')
  const regularPct = calcGainLossPercent(regularValue, price)
  const holidayPct = calcGainLossPercent(holidayValue, price)
  const crystalPct = calcGainLossPercent(crystalEquivalent, price)
  const crystalNet = crystalEquivalent - price

  // ─── SAB per-tier calculations ────────────────────────────────────────────
  const sabTierRows = packType === 'sab' && sabTiers
    ? sabTiers.map((tier, i) => {
        if (tier.items.length === 0) return null
        const tierCE = calcSabTierCE(tier)
        const cumulative = cumulativeEffectivePrice(sabTiers, sabDiscounts, i)
        const prevCumulative = i > 0 ? cumulativeEffectivePrice(sabTiers, sabDiscounts, i - 1) : 0
        const incrementalPrice = cumulative - prevCumulative
        const standardVal = calcDollarValue(tierCE, 'regular')
        const holidayVal = calcDollarValue(tierCE, 'holiday')
        const stdPct = calcGainLossPercent(standardVal, incrementalPrice)
        const holPct = calcGainLossPercent(holidayVal, incrementalPrice)
        return { i, tierCE, incrementalPrice, standardVal, holidayVal, stdPct, holPct }
      }).filter(Boolean)
    : []

  // ─── SAB total (across all populated tiers) ───────────────────────────────
  const lastPopulatedIdx = sabTiers
    ? sabTiers.reduce((last, t, i) => (t.items.length > 0 ? i : last), -1)
    : -1
  const sabTotalCE = sabTierRows.reduce((s, t) => s + (t?.tierCE ?? 0), 0)
  const sabTotalPrice = lastPopulatedIdx >= 0
    ? cumulativeEffectivePrice(sabTiers!, sabDiscounts, lastPopulatedIdx)
    : 0
  const sabTotalStdVal = calcDollarValue(sabTotalCE, 'regular')
  const sabTotalHolVal = calcDollarValue(sabTotalCE, 'holiday')
  const sabTotalStdPct = calcGainLossPercent(sabTotalStdVal, sabTotalPrice)
  const sabTotalHolPct = calcGainLossPercent(sabTotalHolVal, sabTotalPrice)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {packType === 'sab' ? 'Slice-A-Bundle Value' : 'Pack Value'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">

          {/* ── SAB layout ── */}
          {packType === 'sab' && sabTierRows.length > 0 && (
            <>
              {/* Per-tier breakdown — only when 2+ tiers are populated */}
              {sabTierRows.length > 1 && (
                <>
                  {sabTierRows.map((t) => t && (
                    <div key={t.i} className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Tier {t.i + 1}{t.incrementalPrice > 0 ? ` — $${t.incrementalPrice.toFixed(2)}` : ''}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg crystal equivalent</span>
                        <span className="font-medium">{Math.round(t.tierCE).toLocaleString()}✦</span>
                      </div>
                      {t.incrementalPrice > 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Regular pricing</span>
                            <span className="flex items-center">
                              ${t.standardVal.toFixed(2)}
                              <GainBadge pct={t.stdPct} />
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Holiday pricing</span>
                            <span className="flex items-center">
                              ${t.holidayVal.toFixed(2)}
                              <GainBadge pct={t.stdPct} displayPct={t.holPct} />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <Separator />
                </>
              )}

              {/* Totals (also serves as the flat view for single-tier) */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crystal equivalent</span>
                <span className="font-medium">{Math.round(sabTotalCE).toLocaleString()}✦</span>
              </div>
              {sabTotalPrice > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bundle price</span>
                    <span className="font-medium">${sabTotalPrice.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Regular pricing</span>
                    <span className="flex items-center">
                      ${sabTotalStdVal.toFixed(2)}
                      <GainBadge pct={sabTotalStdPct} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Holiday pricing</span>
                    <span className="flex items-center">
                      ${sabTotalHolVal.toFixed(2)}
                      <GainBadge pct={sabTotalStdPct} displayPct={sabTotalHolPct} />
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Standard pack layout ── */}
          {packType !== 'sab' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crystal equivalent</span>
                <span className="font-medium">{Math.round(crystalEquivalent).toLocaleString()}✦</span>
              </div>

              {price > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pack price</span>
                    <span className="font-medium">
                      {isCrystalPack ? `${price.toLocaleString()}✦` : `$${price.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />

                  {isCrystalPack ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Net crystals ({crystalNet >= 0 ? '+' : ''}{crystalNet.toLocaleString()}✦)
                      </span>
                      <GainBadge pct={crystalPct} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Regular pricing</span>
                        <span className="flex items-center">
                          ${regularValue.toFixed(2)}
                          <GainBadge pct={regularPct} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Holiday pricing</span>
                        <span className="flex items-center">
                          ${holidayValue.toFixed(2)}
                          <GainBadge pct={regularPct} displayPct={holidayPct} />
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Separator />
              <Button type="button" className="w-full" onClick={() => setDialogOpen(true)}>
                Save to Library
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <SaveToLibraryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          packType={packType}
          items={items}
          price={price}
          priceCurrency={priceCurrency}
          crystalEquivalent={crystalEquivalent}
          sabTiers={sabTiers}
          sabDiscounts={sabDiscounts}
        />
      )}
    </>
  )
}
