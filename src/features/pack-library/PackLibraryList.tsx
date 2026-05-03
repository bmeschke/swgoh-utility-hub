import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/clerk-react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  calcDollarValue,
  calcGainLossPercent,
  calcSabTotalPriceFromTiers,
  calcAscensionTotalPriceFromTiers,
} from '@/lib/valuations'
import PackCard from './PackCard'
import { SearchIcon, XIcon, SlidersHorizontalIcon, PackageIcon } from 'lucide-react'

// ── Category config ───────────────────────────────────────────────────────────

const ALL_CATEGORY_IDS = ['excellent', 'good', 'fair', 'scam'] as const

const VALUE_CATEGORIES: { id: string; label: string; color: string }[] = [
  { id: 'excellent', label: 'Excellent', color: 'text-green-400' },
  { id: 'good', label: 'Good', color: 'text-blue-400' },
  { id: 'fair', label: 'Fair', color: 'text-purple-400' },
  { id: 'scam', label: 'Scam', color: 'text-red-400' },
]

// ── Pack type config ──────────────────────────────────────────────────────────

const ALL_TYPE_IDS = ['standard', 'ascension', 'sab'] as const

const PACK_TYPES: { id: string; label: string }[] = [
  { id: 'standard', label: 'Standard Pack' },
  { id: 'ascension', label: 'Ascension Pack' },
  { id: 'sab', label: 'Slice-A-Bundle' },
]

// ── Filter helpers ────────────────────────────────────────────────────────────

function getPct(pack: Doc<'packs'>): number {
  const isSab = pack.packType === 'sab'
  const isAscension = pack.packType === 'ascension'
  const isCrystalPack = !isSab && !isAscension && pack.priceCurrency === 'crystals'
  const sabTotalPrice = isSab && pack.sabTiers ? calcSabTotalPriceFromTiers(pack.sabTiers) : 0
  const ascensionTotalPrice =
    isAscension && pack.ascensionTiers ? calcAscensionTotalPriceFromTiers(pack.ascensionTiers) : 0
  const effectivePrice = isSab ? sabTotalPrice : isAscension ? ascensionTotalPrice : pack.price
  return isCrystalPack
    ? calcGainLossPercent(pack.crystalEquivalent, pack.price)
    : calcGainLossPercent(calcDollarValue(pack.crystalEquivalent, 'regular'), effectivePrice)
}

function matchesCategories(pct: number, enabled: Set<string>): boolean {
  if (enabled.size === 4) return true
  if (enabled.has('excellent') && pct >= 145) return true
  if (enabled.has('good') && pct >= 45 && pct < 145) return true
  if (enabled.has('fair') && pct > 0 && pct < 45) return true
  if (enabled.has('scam') && pct <= 0) return true
  return false
}

function matchesType(pack: Doc<'packs'>, enabled: Set<string>): boolean {
  if (enabled.size === 3) return true
  const type =
    pack.packType === 'sab' ? 'sab' : pack.packType === 'ascension' ? 'ascension' : 'standard'
  return enabled.has(type)
}

function packContainsItem(pack: Doc<'packs'>, itemId: string): boolean {
  if (pack.packType === 'sab') {
    return pack.sabTiers?.some((t) => t.items.some((i) => i.itemId === itemId)) ?? false
  }
  if (pack.packType === 'ascension') {
    return pack.ascensionTiers?.some((t) => t.items.some((i) => i.itemId === itemId)) ?? false
  }
  // standard or undefined (legacy packs without packType set) — check top-level items array
  return pack.items.some((i) => i.itemId === itemId)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PackLibraryList() {
  const { user } = useUser()
  const isAdmin =
    !!import.meta.env.VITE_ADMIN_USER_ID && user?.id === import.meta.env.VITE_ADMIN_USER_ID
  const publishedPacks = useQuery(api.packs.listPublished, isAdmin ? 'skip' : {})
  const allPacks = useQuery(api.packs.listAll, isAdmin ? {} : 'skip')
  const packs = isAdmin ? allPacks : publishedPacks
  const items = useQuery(api.items.list) ?? []

  // All filter state lives in URL params for free back-nav persistence
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const selectedItemId = searchParams.get('item') ?? ''
  const enabledCategories: Set<string> = searchParams.has('categories')
    ? new Set(searchParams.get('categories')!.split(',').filter(Boolean))
    : new Set(ALL_CATEGORY_IDS)
  const enabledTypes: Set<string> = searchParams.has('types')
    ? new Set(searchParams.get('types')!.split(',').filter(Boolean))
    : new Set(ALL_TYPE_IDS)

  // Local UI state for dropdowns / item search input
  const [valueOpen, setValueOpen] = useState(false)
  const [itemOpen, setItemOpen] = useState(false)
  const [itemSearch, setItemSearch] = useState('')

  function setParam(key: string, value: string | null) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true }
    )
  }

  function toggleCategory(id: string) {
    const next = new Set(enabledCategories)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setParam('categories', next.size === 4 ? null : [...next].join(','))
  }

  function toggleType(id: string) {
    const next = new Set(enabledTypes)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setParam('types', next.size === 3 ? null : [...next].join(','))
  }

  const selectedItem = items.find((i) => i._id === selectedItemId)
  const filteredItems = items.filter((i) => i.name.toLowerCase().includes(itemSearch.toLowerCase()))

  const isFiltered = search || enabledCategories.size < 4 || enabledTypes.size < 3 || selectedItemId

  if (packs === undefined) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  const filtered = packs
    .filter((pack) => {
      if (search && !pack.name.toLowerCase().includes(search.toLowerCase())) return false
      if (!matchesCategories(getPct(pack), enabledCategories)) return false
      if (!matchesType(pack, enabledTypes)) return false
      if (selectedItemId && !packContainsItem(pack, selectedItemId)) return false
      return true
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      {/* Search bar with embedded filter icons */}
      <div className="relative w-full">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search packs by name..."
          value={search}
          onChange={(e) => setParam('q', e.target.value || null)}
          className="pl-8 pr-24"
        />

        {/* Right-side controls: X | value-icon item-icon */}
        <div className="absolute right-0 top-0 flex h-full items-center gap-0.5 pr-1">
          {search && (
            <button
              type="button"
              onClick={() => setParam('q', null)}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}

          <span className="mx-1 h-4 w-px shrink-0 bg-border" />

          {/* Value filter */}
          <Popover open={valueOpen} onOpenChange={setValueOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label="Filter by value"
                  className={cn(
                    'relative rounded p-1 transition-colors',
                    enabledCategories.size < 4 || enabledTypes.size < 3
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                />
              }
            >
              <SlidersHorizontalIcon className="size-4" />
              {(enabledCategories.size < 4 || enabledTypes.size < 3) && (
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-blue-500" />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="end">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Filter by Value
              </p>
              <div className="space-y-1.5">
                {VALUE_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex cursor-pointer select-none items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className="size-3.5"
                      checked={enabledCategories.has(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    <span className={cn('text-sm font-medium', cat.color)}>{cat.label}</span>
                  </label>
                ))}
              </div>
              <Separator className="my-3" />
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Filter by Type
              </p>
              <div className="space-y-1.5">
                {PACK_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex cursor-pointer select-none items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className="size-3.5"
                      checked={enabledTypes.has(type.id)}
                      onChange={() => toggleType(type.id)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Item filter */}
          <Popover open={itemOpen} onOpenChange={setItemOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label="Filter by contents"
                  className={cn(
                    'relative rounded p-1 transition-colors',
                    selectedItemId
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                />
              }
            >
              <PackageIcon className="size-4" />
              {selectedItemId && (
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-blue-500" />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="px-3 pb-2 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Filter by Contents
                </p>
                {selectedItem && (
                  <div className="mb-2 flex items-center justify-between gap-2 rounded bg-muted px-2 py-1">
                    <span className="truncate text-sm">{selectedItem.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setParam('item', null)
                        setItemOpen(false)
                      }}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label="Clear item filter"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                )}
              </div>
              <Command>
                <CommandInput
                  placeholder="Search items..."
                  value={itemSearch}
                  onValueChange={setItemSearch}
                />
                <CommandList className="max-h-48">
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                    {filteredItems.slice(0, 50).map((item) => (
                      <CommandItem
                        key={item._id}
                        value={item.name}
                        onSelect={() => {
                          setParam('item', item._id)
                          setItemSearch('')
                          setItemOpen(false)
                        }}
                      >
                        <span className="flex-1 text-sm">{item.name}</span>
                        {item.category && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          {isFiltered ? 'No packs match your filters.' : 'No packs in the library yet.'}
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
