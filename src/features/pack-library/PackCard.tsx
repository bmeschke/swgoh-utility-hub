import { Link } from 'react-router-dom'
import type { Doc } from '../../../convex/_generated/dataModel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dices } from 'lucide-react'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
  getValueBorderClass,
  getValueHeaderBgClass,
  getValueRowBgClass,
  calcSabTotalPriceFromTiers,
  calcAscensionTotalPriceFromTiers,
} from '@/lib/valuations'

interface PackCardProps {
  pack: Doc<'packs'>
  showUnpublished?: boolean
}

export default function PackCard({ pack, showUnpublished }: PackCardProps) {
  const isSab = pack.packType === 'sab'
  const isAscension = pack.packType === 'ascension'
  const isCrystalPack = !isSab && !isAscension && pack.priceCurrency === 'crystals'

  // For SABs: use avg CE (stored as crystalEquivalent) vs total all-tier price
  const sabTotalPrice = isSab && pack.sabTiers ? calcSabTotalPriceFromTiers(pack.sabTiers) : 0
  // For Ascension: use total CE vs total all-tier price
  const ascensionTotalPrice =
    isAscension && pack.ascensionTiers ? calcAscensionTotalPriceFromTiers(pack.ascensionTiers) : 0
  const effectivePrice = isSab ? sabTotalPrice : isAscension ? ascensionTotalPrice : pack.price

  const pct = isCrystalPack
    ? calcGainLossPercent(pack.crystalEquivalent, pack.price)
    : calcGainLossPercent(calcDollarValue(pack.crystalEquivalent, 'regular'), effectivePrice)

  const label = getRecommendationLabel(pct)
  const sign = pct >= 0 ? '+' : ''

  const standardValue = calcDollarValue(pack.crystalEquivalent, 'regular')
  const holidayValue = calcDollarValue(pack.crystalEquivalent, 'holiday')
  const hasRolledItems = pack.items.some((i) => i.tiers && i.tiers.length > 0)
  const isUnpublished = showUnpublished && !pack.published

  return (
    <Link to={`/pack-library/${pack._id}`}>
      <Card
        className={`hover:bg-muted/30 transition-colors cursor-pointer h-full overflow-hidden border ${getValueBorderClass(pct)} ${isUnpublished ? 'opacity-50' : ''}`}
      >
        <CardHeader className={`-mt-4 pt-4 pb-3 ${getValueHeaderBgClass(pct)}`}>
          <CardTitle className="text-sm font-semibold line-clamp-2 flex items-center gap-1.5">
            {pack.name}
            {isSab && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 font-semibold">
                SAB
              </Badge>
            )}
            {isAscension && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 font-semibold">
                ASC
              </Badge>
            )}
            {hasRolledItems && <Dices className="size-3.5 shrink-0 opacity-70" />}
            {isUnpublished && (
              <span className="text-xs font-normal text-muted-foreground">(unpublished)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm pt-3">
          {isSab ? (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Price Range</span>
                <span>
                  ${pack.price.toFixed(2)}
                  {sabTotalPrice > pack.price && ` – $${sabTotalPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Avg Standard Value</span>
                <span>${standardValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Avg Holiday Value</span>
                <span>${holidayValue.toFixed(2)}</span>
              </div>
            </>
          ) : isAscension ? (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Price Range</span>
                <span>
                  ${pack.price.toFixed(2)}
                  {ascensionTotalPrice > pack.price && ` – $${ascensionTotalPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Standard Value</span>
                <span>${standardValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Holiday Value</span>
                <span>${holidayValue.toFixed(2)}</span>
              </div>
            </>
          ) : isCrystalPack ? (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Price</span>
                <span>{pack.price.toLocaleString()}✦</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Crystal Value</span>
                <span>{pack.crystalEquivalent.toLocaleString()}✦</span>
              </div>
              <div className="flex justify-between text-muted-foreground invisible">
                <span>—</span>
                <span>—</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Price</span>
                <span>${pack.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Standard Value</span>
                <span>${standardValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Holiday Value</span>
                <span>${holidayValue.toFixed(2)}</span>
              </div>
            </>
          )}

          <div
            className={`flex justify-between items-center px-2 py-1 rounded-md -mx-2 ${getValueRowBgClass(pct)}`}
          >
            <span className="text-muted-foreground">{isSab ? 'Avg Value' : 'Value'}</span>
            <Badge className={`text-xs border ${getValueBadgeClass(pct)}`}>
              {sign}
              {pct.toFixed(1)}% — {label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
