import { Link } from 'react-router-dom'
import type { Doc } from '../../../convex/_generated/dataModel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
  getValueBorderClass,
  getValueHeaderBgClass,
  getValueRowBgClass,
} from '@/lib/valuations'

interface PackCardProps {
  pack: Doc<'packs'>
}

export default function PackCard({ pack }: PackCardProps) {
  const isCrystalPack = pack.priceCurrency === 'crystals'

  const pct = isCrystalPack
    ? calcGainLossPercent(pack.crystalEquivalent, pack.price)
    : calcGainLossPercent(calcDollarValue(pack.crystalEquivalent, 'regular'), pack.price)

  const label = getRecommendationLabel(pct)
  const sign = pct >= 0 ? '+' : ''
  const priceDisplay = isCrystalPack
    ? `${pack.price.toLocaleString()}✦`
    : `$${pack.price.toFixed(2)}`

  const standardValue = calcDollarValue(pack.crystalEquivalent, 'regular')
  const holidayValue = calcDollarValue(pack.crystalEquivalent, 'holiday')

  return (
    <Link to={`/pack-library/${pack._id}`}>
      <Card className={`hover:bg-muted/30 transition-colors cursor-pointer h-full overflow-hidden border ${getValueBorderClass(pct)}`}>
        {/* Pull header flush with top of card by negating Card's pt-4 */}
        <CardHeader className={`-mt-4 pt-4 pb-3 ${getValueHeaderBgClass(pct)}`}>
          <CardTitle className="text-sm font-semibold line-clamp-2">
            {pack.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm pt-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Price</span>
            <span>{priceDisplay}</span>
          </div>

          {isCrystalPack ? (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Crystal Value</span>
                <span>{pack.crystalEquivalent.toLocaleString()}✦</span>
              </div>
              {/* Spacer to align value row with dollar packs that have two value rows */}
              <div className="flex justify-between text-muted-foreground invisible">
                <span>—</span>
                <span>—</span>
              </div>
            </>
          ) : (
            <>
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

          <div className={`flex justify-between items-center px-2 py-1 rounded-md -mx-2 ${getValueRowBgClass(pct)}`}>
            <span className="text-muted-foreground">Value</span>
            <Badge className={`text-xs border ${getValueBadgeClass(pct)}`}>
              {sign}{pct.toFixed(1)}% — {label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
