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
} from '@/lib/valuations'
import SaveToLibraryDialog from './SaveToLibraryDialog'
import type { EvalLineItem } from './EvaluatePackForm'

interface PackValueResultProps {
  crystalEquivalent: number
  price: number
  priceCurrency: PriceCurrency
  items: EvalLineItem[]
}

function GainBadge({ pct }: { pct: number }) {
  const label = getRecommendationLabel(pct)
  const sign = pct >= 0 ? '+' : ''
  const variant = pct > 5 ? 'default' : pct >= -5 ? 'secondary' : 'destructive'
  return (
    <Badge variant={variant} className="ml-2 text-xs">
      {sign}{pct.toFixed(1)}% — {label}
    </Badge>
  )
}

export default function PackValueResult({
  crystalEquivalent,
  price,
  priceCurrency,
  items,
}: PackValueResultProps) {
  const { user } = useUser()
  const isAdmin = user?.id === import.meta.env.VITE_ADMIN_USER_ID
  const [dialogOpen, setDialogOpen] = useState(false)

  const isCrystalPack = priceCurrency === 'crystals'

  // USD pack calculations
  const regularValue = calcDollarValue(crystalEquivalent, 'regular')
  const holidayValue = calcDollarValue(crystalEquivalent, 'holiday')
  const regularPct = calcGainLossPercent(regularValue, price)
  const holidayPct = calcGainLossPercent(holidayValue, price)

  // Crystal pack calculations
  const crystalPct = calcGainLossPercent(crystalEquivalent, price)
  const crystalNet = crystalEquivalent - price

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pack Value</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Crystal equivalent</span>
            <span className="font-medium">{crystalEquivalent.toLocaleString()}✦</span>
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
                      <GainBadge pct={holidayPct} />
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Separator />
              <Button
                type="button"
                className="w-full"
                onClick={() => setDialogOpen(true)}
              >
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
          items={items}
          price={price}
          priceCurrency={priceCurrency}
          crystalEquivalent={crystalEquivalent}
        />
      )}
    </>
  )
}
