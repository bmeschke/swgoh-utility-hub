import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/clerk-react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
} from '@/lib/valuations'
import { ArrowLeftIcon, Dices } from 'lucide-react'
import EditPackForm from './EditPackForm'

interface PackDetailProps {
  packId: Id<'packs'>
}

function GainBadge({ pct, label: labelOverride }: { pct: number; label?: string }) {
  const label = getRecommendationLabel(pct)
  const sign = pct >= 0 ? '+' : ''
  const displayPct = labelOverride ?? `${sign}${pct.toFixed(1)}%`
  return (
    <Badge className={`text-xs border ${getValueBadgeClass(pct)}`}>
      {displayPct} — {label}
    </Badge>
  )
}

export default function PackDetail({ packId }: PackDetailProps) {
  const navigate = useNavigate()
  const { user } = useUser()
  const isAdmin = user?.id === import.meta.env.VITE_ADMIN_USER_ID
  const [isEditing, setIsEditing] = useState(false)

  const pack = useQuery(api.packs.get, { id: packId })
  const togglePublished = useMutation(api.packs.togglePublished)
  const deletePack = useMutation(api.packs.deletePack)

  if (pack === undefined) return <p className="text-muted-foreground">Loading...</p>
  if (pack === null) return <p className="text-muted-foreground">Pack not found.</p>

  if (isEditing) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Edit Pack</h1>
        <EditPackForm
          pack={pack}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      </div>
    )
  }

  const isCrystalPack = pack.priceCurrency === 'crystals'
  const priceDisplay = isCrystalPack
    ? `${pack.price.toLocaleString()}✦`
    : `$${pack.price.toFixed(2)}`

  const regularValue = calcDollarValue(pack.crystalEquivalent, 'regular')
  const holidayValue = calcDollarValue(pack.crystalEquivalent, 'holiday')
  const regularPct = calcGainLossPercent(regularValue, pack.price)
  const holidayPct = calcGainLossPercent(holidayValue, pack.price)
  const crystalPct = calcGainLossPercent(pack.crystalEquivalent, pack.price)
  const crystalNet = pack.crystalEquivalent - pack.price

  async function handleDelete() {
    if (!confirm('Delete this pack?')) return
    await deletePack({ id: packId })
    navigate('/pack-library')
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold">{pack.name}</h1>
        {pack.notes && (
          <p className="mt-1 text-sm text-muted-foreground">{pack.notes}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {pack.itemsWithDetails.map((item, i) => {
            const isRolled = item.tiers && item.tiers.length > 0
            return (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    {item.name}
                    {isRolled && <Dices className="size-3 text-muted-foreground" />}
                  </span>
                  <span className="text-muted-foreground">
                    {isRolled ? '~' : ''}{item.quantity}×{item.crystalValue.toLocaleString()}✦ = {isRolled ? '~' : ''}{(item.crystalValue * item.quantity).toLocaleString()}✦
                  </span>
                </div>
                {isRolled && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 pl-4 text-xs text-muted-foreground">
                    {item.tiers!.map((t, ti) => (
                      <span key={ti}>{t.probability}% → {t.quantity}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valuation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pack price</span>
            <span className="font-medium">{priceDisplay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Crystal equivalent</span>
            <span className="font-medium">{pack.crystalEquivalent.toLocaleString()}✦</span>
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
                <span className="flex items-center gap-2">
                  ${regularValue.toFixed(2)}
                  <GainBadge pct={regularPct} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Holiday pricing</span>
                <span className="flex items-center gap-2">
                  ${holidayValue.toFixed(2)}
                  <GainBadge pct={regularPct} label={`+${holidayPct.toFixed(1)}%`} />
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => togglePublished({ id: packId })}
          >
            {pack.published ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}
