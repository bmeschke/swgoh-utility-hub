import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/clerk-react'
import { api } from '../../../convex/_generated/api'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { calcDollarValue, calcGainLossPercent } from '@/lib/valuations'
import PackCard from './PackCard'
import { SearchIcon } from 'lucide-react'

type ValueFilter = 'excellent' | 'good' | 'fair' | 'scam' | null

const VALUE_FILTERS: { id: ValueFilter; label: string; style: string; activeStyle: string }[] = [
  {
    id: 'excellent',
    label: 'Excellent',
    style: 'border-green-500/50 text-green-300 hover:bg-green-500/10',
    activeStyle: 'bg-green-500/20 border-green-500/70 text-green-200',
  },
  {
    id: 'good',
    label: 'Good+',
    style: 'border-blue-500/50 text-blue-300 hover:bg-blue-500/10',
    activeStyle: 'bg-blue-500/20 border-blue-500/70 text-blue-200',
  },
  {
    id: 'fair',
    label: 'Fair+',
    style: 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10',
    activeStyle: 'bg-purple-500/20 border-purple-500/70 text-purple-200',
  },
  {
    id: 'scam',
    label: 'Scam',
    style: 'border-red-500/50 text-red-300 hover:bg-red-500/10',
    activeStyle: 'bg-red-500/20 border-red-500/70 text-red-200',
  },
]

function getPct(pack: { crystalEquivalent: number; price: number; priceCurrency?: string }) {
  const isCrystalPack = pack.priceCurrency === 'crystals'
  return isCrystalPack
    ? calcGainLossPercent(pack.crystalEquivalent, pack.price)
    : calcGainLossPercent(calcDollarValue(pack.crystalEquivalent, 'regular'), pack.price)
}

function matchesFilter(pct: number, filter: ValueFilter): boolean {
  if (filter === null) return true
  if (filter === 'excellent') return pct >= 145
  if (filter === 'good') return pct >= 45
  if (filter === 'fair') return pct > 0
  if (filter === 'scam') return pct <= 0
  return true
}

export default function PackLibraryList() {
  const { user } = useUser()
  const isAdmin = !!import.meta.env.VITE_ADMIN_USER_ID && user?.id === import.meta.env.VITE_ADMIN_USER_ID
  const publishedPacks = useQuery(api.packs.listPublished, isAdmin ? 'skip' : {})
  const allPacks = useQuery(api.packs.listAll, isAdmin ? {} : 'skip')
  const packs = isAdmin ? allPacks : publishedPacks
  const [search, setSearch] = useState('')
  const [valueFilter, setValueFilter] = useState<ValueFilter>(null)

  if (packs === undefined) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  const filtered = packs
    .filter((pack) => {
      const matchesSearch = pack.name.toLowerCase().includes(search.toLowerCase())
      const matchesValue = matchesFilter(getPct(pack), valueFilter)
      return matchesSearch && matchesValue
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search packs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-56"
          />
        </div>

        <div className="flex items-center gap-2">
          {VALUE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setValueFilter(valueFilter === f.id ? null : f.id)}
              className={cn(
                'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                valueFilter === f.id ? f.activeStyle : f.style
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          {search || valueFilter ? 'No packs match your filters.' : 'No packs in the library yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pack) => (
            <PackCard key={pack._id} pack={pack} showUnpublished={isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}
