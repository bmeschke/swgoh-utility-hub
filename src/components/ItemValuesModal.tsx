import { useQuery } from 'convex/react'
import { InfoIcon } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

// ── Category helpers (mirrors PackDetail.tsx) ────────────────────────────────

function normaliseCategory(raw: string | undefined): string {
  if (!raw) return 'Other'
  if (raw.startsWith('Shard')) return 'Shards'
  const MAP: Record<string, string> = {
    'Ability Material': 'Ability Materials',
    'Mod Material': 'Mod Materials',
    'Datacron Material': 'Datacron Materials',
    'Gear - G12': 'Gear - G12',
    'Gear - G12+': 'Gear - G12+',
    'Gear - Relic Material': 'Gear - Relic Materials',
  }
  return MAP[raw] ?? raw
}

const CATEGORY_ORDER = [
  'Currency',
  'Energy',
  'Shards',
  'Ability Materials',
  'Mod Materials',
  'Datacron Materials',
  'Gear - Purple',
  'Gear - Kyrotech',
  'Gear - G12',
  'Gear - G12+',
  'Gear - Finisher',
  'Gear - Signal Data',
  'Gear - Relic Materials',
]

function sortCategories(cats: string[]): string[] {
  return [...cats].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })
}

// ── Modal content ─────────────────────────────────────────────────────────────

function ItemValuesContent() {
  const items = useQuery(api.items.list)

  if (items === undefined) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  // Group by normalised category
  const grouped = new Map<string, typeof items>()
  for (const item of items) {
    const cat = normaliseCategory(item.category)
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(item)
  }

  const sortedCategories = sortCategories([...grouped.keys()])

  return (
    <div className="space-y-5">
      {sortedCategories.map((cat) => {
        const catItems = (grouped.get(cat) ?? [])
          .slice()
          .sort((a, b) => b.crystalValue - a.crystalValue || a.name.localeCompare(b.name))
        return (
          <div key={cat}>
            <Separator className="mb-5" />
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {cat}
            </p>
            <div className="space-y-1">
              {catItems.map((item) => (
                <div key={item._id} className="flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <span>{item.name}</span>
                    {item.source && (
                      <div className="text-xs text-muted-foreground">{item.source}</div>
                    )}
                  </div>
                  <span className="tabular-nums font-medium text-muted-foreground shrink-0">
                    {item.crystalValue.toLocaleString()}✦
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Exported trigger + modal ──────────────────────────────────────────────────

export default function ItemValuesModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          />
        }
      >
        <InfoIcon className="size-4" />
        Item Values
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Item Crystal Values</DialogTitle>
          <DialogDescription>
            Crystal values are anchored to a common baseline: the shipments store, where most items
            have a fixed crystal price. Items not sold in shipments are valued by conversion rate or
            equivalent crystal cost. Pack totals are the sum of each item's crystal value ×
            quantity.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1">
          <div className="space-y-4 pb-4 text-sm">
            <Separator />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What does the % value mean?
              </p>
              <p className="text-muted-foreground">
                The % value compares a pack's total crystal value against its price in crystals. A
                pack worth more than it costs is a positive value; one worth less is negative.
              </p>
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium text-foreground">Example:</span> a pack that costs
                1,000✦ but contains items worth 2,000✦ is{' '}
                <span className="text-blue-400 font-medium">+100% — Good</span>.
              </p>
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium text-foreground">Value categories:</span>{' '}
                <span className="font-medium text-green-400">Excellent (≥+145%)</span>,{' '}
                <span className="font-medium text-blue-400">Good (+45% - 144%)</span>,{' '}
                <span className="font-medium text-purple-400">Fair (+1% - 44%)</span>,{' '}
                <span className="font-medium text-red-400">Scam (≤0%)</span>
              </p>
            </div>
            <Separator />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Standard value vs. holiday value
              </p>
              <p className="text-muted-foreground">
                Both values answer the same question: given a pack's total crystal value, what would
                it cost in dollars to buy that many crystals outright? They differ only in the
                exchange rate used.
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Standard value</span> — crystals at
                  165✦ per dollar, the year-round rate.
                </li>
                <li>
                  <span className="font-medium text-foreground">Holiday value</span> — crystals at
                  212✦ per dollar, the discounted rate during sale events (New Year's, Star Wars
                  Day, etc.).
                </li>
              </ul>
            </div>
          </div>
          <ItemValuesContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
