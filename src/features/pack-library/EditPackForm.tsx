import { useRef, useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calcCrystalEquivalent, type PriceCurrency, type ProbabilityTier } from '@/lib/valuations'
import {
  DEFAULT_SAB_TIERS,
  DEFAULT_SAB_DISCOUNTS,
  type SabTierDraft,
  type SabDiscount,
  DEFAULT_ASCENSION_TIERS,
  type AscensionTierDraft,
} from '@/lib/valuations'
import { cn } from '@/lib/utils'
import ItemCombobox, { type ItemComboboxHandle } from '@/features/pack-evaluation/ItemCombobox'
import PackLineItem from '@/features/pack-evaluation/PackLineItem'
import SabPackBuilder from '@/features/pack-evaluation/SabPackBuilder'
import AscensionPackBuilder from '@/features/pack-evaluation/AscensionPackBuilder'
import type { Doc } from '../../../convex/_generated/dataModel'

type PackType = 'standard' | 'sab' | 'ascension'

interface LineItem {
  itemId: string
  name: string
  crystalValue: number
  quantity: number
  tiers?: ProbabilityTier[]
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional(),
})

interface FormValues {
  name: string
  notes: string
  items: LineItem[]
  price: string
  priceCurrency: PriceCurrency
}

interface EditPackFormProps {
  pack: Doc<'packs'> & {
    itemsWithDetails: {
      itemId: Id<'items'>
      quantity: number
      name: string
      crystalValue: number
      tiers?: { probability: number; quantity: number }[]
    }[]
  }
  onCancel: () => void
  onSaved: () => void
}

function sabDiscountsToDraft(sabDiscounts: Doc<'packs'>['sabDiscounts']): SabDiscount[] {
  if (!sabDiscounts || sabDiscounts.length === 0) return DEFAULT_SAB_DISCOUNTS
  return [1, 2, 3].map((q) => {
    const found = sabDiscounts.find((d) => d.quantity === q)
    return { quantity: q, discountAmount: found ? String(found.discountAmount) : '' }
  })
}

export default function EditPackForm({ pack, onCancel, onSaved }: EditPackFormProps) {
  const updatePack = useMutation(api.packs.update)

  const initialPackType: PackType =
    pack.packType === 'sab' ? 'sab' : pack.packType === 'ascension' ? 'ascension' : 'standard'
  const [packType, setPackType] = useState<PackType>(initialPackType)

  // Initialise SAB draft state — use sabTiersWithDetails for item names if available
  const enrichedTiers = (pack as { sabTiersWithDetails?: typeof pack.sabTiers }).sabTiersWithDetails
  const initialSabTiers: SabTierDraft[] = (() => {
    const src = enrichedTiers ?? pack.sabTiers
    if (!src || src.length === 0) return DEFAULT_SAB_TIERS
    const drafts: SabTierDraft[] = src.map((tier) => ({
      price: String(tier.price),
      items: tier.items.map((li) => ({
        itemId: li.itemId,
        name: (li as { name?: string }).name ?? '…',
        crystalValue: (li as { crystalValue?: number }).crystalValue ?? 0,
        quantity: li.quantity,
      })),
    }))
    while (drafts.length < 3) drafts.push({ price: '', items: [] })
    return drafts
  })()

  const [sabTiers, setSabTiers] = useState<SabTierDraft[]>(initialSabTiers)
  const [sabDiscounts, setSabDiscounts] = useState<SabDiscount[]>(
    sabDiscountsToDraft(pack.sabDiscounts)
  )

  // Initialise Ascension draft state
  const enrichedAscensionTiers = (
    pack as { ascensionTiersWithDetails?: typeof pack.ascensionTiers }
  ).ascensionTiersWithDetails
  const initialAscensionTiers: AscensionTierDraft[] = (() => {
    const src = enrichedAscensionTiers ?? pack.ascensionTiers
    if (!src || src.length === 0) return DEFAULT_ASCENSION_TIERS
    return src.map((tier) => ({
      price: String(tier.price),
      items: tier.items.map((li) => ({
        itemId: li.itemId,
        name: (li as { name?: string }).name ?? '…',
        crystalValue: (li as { crystalValue?: number }).crystalValue ?? 0,
        quantity: li.quantity,
      })),
    }))
  })()

  const [ascensionTiers, setAscensionTiers] = useState<AscensionTierDraft[]>(initialAscensionTiers)

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: pack.name,
      notes: pack.notes ?? '',
      items: pack.itemsWithDetails.map((i) => ({
        itemId: i.itemId,
        name: i.name,
        crystalValue: i.crystalValue,
        quantity: i.quantity,
        tiers: i.tiers,
      })),
      price: String(pack.price),
      priceCurrency: (pack.priceCurrency ?? 'usd') as PriceCurrency,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = watch('items')
  const watchedPrice = watch('price')
  const priceCurrency = watch('priceCurrency')
  const crystalEquivalent = calcCrystalEquivalent(watchedItems)
  const price = parseFloat(watchedPrice) || 0

  const comboboxRef = useRef<ItemComboboxHandle>(null)
  const qtyRefs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocusIndex = useRef<number | null>(null)

  useEffect(() => {
    if (pendingFocusIndex.current !== null) {
      const idx = pendingFocusIndex.current
      pendingFocusIndex.current = null
      const input = qtyRefs.current[idx]
      if (input) {
        input.focus()
        input.select()
      }
    }
  }, [fields.length])

  function handleAddItem(item: Doc<'items'>) {
    pendingFocusIndex.current = fields.length
    append({ itemId: item._id, name: item.name, crystalValue: item.crystalValue, quantity: 1 })
  }

  async function onSubmit(values: FormValues) {
    if (packType === 'sab') {
      await updatePack({
        id: pack._id,
        name: values.name,
        packType: 'sab',
        sabTiers: sabTiers.map((tier) => ({
          price: parseFloat(tier.price) || 0,
          items: tier.items.map((item) => ({
            itemId: item.itemId as Id<'items'>,
            quantity: item.quantity,
          })),
        })),
        sabDiscounts: sabDiscounts
          .filter((d) => parseFloat(d.discountAmount) > 0)
          .map((d) => ({ quantity: d.quantity, discountAmount: parseFloat(d.discountAmount) })),
        notes: values.notes || undefined,
      })
    } else if (packType === 'ascension') {
      await updatePack({
        id: pack._id,
        name: values.name,
        packType: 'ascension',
        ascensionTiers: ascensionTiers.map((tier) => ({
          price: parseFloat(tier.price) || 0,
          items: tier.items.map((item) => ({
            itemId: item.itemId as Id<'items'>,
            quantity: item.quantity,
          })),
        })),
        notes: values.notes || undefined,
      })
    } else {
      await updatePack({
        id: pack._id,
        name: values.name,
        price,
        priceCurrency,
        packType: 'standard',
        items: watchedItems.map((item) => ({
          itemId: item.itemId as Id<'items'>,
          quantity: item.quantity,
          tiers: item.tiers,
        })),
        notes: values.notes || undefined,
      })
    }
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="edit-name">Pack name</Label>
        <Input id="edit-name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Pack type toggle */}
      <div className="space-y-1.5">
        <Label>Pack type</Label>
        <div className="flex rounded-lg border text-sm overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => setPackType('standard')}
            className={cn(
              'px-4 py-1.5 transition-colors',
              packType === 'standard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setPackType('sab')}
            className={cn(
              'px-4 py-1.5 border-l transition-colors',
              packType === 'sab' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Slice-A-Bundle
          </button>
          <button
            type="button"
            onClick={() => setPackType('ascension')}
            className={cn(
              'px-4 py-1.5 border-l transition-colors',
              packType === 'ascension' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Ascension
          </button>
        </div>
      </div>

      {packType === 'standard' ? (
        <>
          <div className="space-y-2">
            <Label>Items</Label>
            <ItemCombobox ref={comboboxRef} onAdd={handleAddItem} />
            {fields.length > 0 && (
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <PackLineItem
                    key={field.id}
                    name={field.name}
                    crystalValue={field.crystalValue}
                    quantity={watchedItems[index]?.quantity ?? field.quantity}
                    tiers={watchedItems[index]?.tiers}
                    onQuantityChange={(qty) => setValue(`items.${index}.quantity`, qty)}
                    onTiersChange={(tiers) => setValue(`items.${index}.tiers`, tiers)}
                    onRemove={() => remove(index)}
                    inputRef={(el) => {
                      qtyRefs.current[index] = el
                    }}
                    onEnter={() => comboboxRef.current?.openAndFocus()}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Pack price</Label>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border text-sm overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setValue('priceCurrency', 'usd')}
                  className={cn(
                    'px-3 py-1 transition-colors',
                    priceCurrency === 'usd'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setValue('priceCurrency', 'crystals')}
                  className={cn(
                    'px-3 py-1 border-l transition-colors',
                    priceCurrency === 'crystals'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  ✦ Crystals
                </button>
              </div>
              <Input
                type="number"
                min={0}
                step={priceCurrency === 'usd' ? 0.01 : 1}
                placeholder={priceCurrency === 'usd' ? 'e.g. 9.99' : 'e.g. 800'}
                {...register('price')}
                className="max-w-[160px]"
              />
            </div>
          </div>

          {crystalEquivalent > 0 && (
            <p className="text-sm text-muted-foreground">
              Crystal equivalent:{' '}
              <span className="font-medium text-foreground">
                {crystalEquivalent.toLocaleString()}✦
              </span>
              {price > 0 && (
                <span className="ml-3">
                  Price:{' '}
                  <span className="font-medium text-foreground">
                    {priceCurrency === 'usd'
                      ? `$${price.toFixed(2)}`
                      : `${price.toLocaleString()}✦`}
                  </span>
                </span>
              )}
            </p>
          )}
        </>
      ) : packType === 'sab' ? (
        <SabPackBuilder
          tiers={sabTiers}
          discounts={sabDiscounts}
          onChange={(t, d) => {
            setSabTiers(t)
            setSabDiscounts(d)
          }}
        />
      ) : (
        <AscensionPackBuilder tiers={ascensionTiers} onChange={(t) => setAscensionTiers(t)} />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="edit-notes">Notes (optional)</Label>
        <Input id="edit-notes" placeholder="Any additional context..." {...register('notes')} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
