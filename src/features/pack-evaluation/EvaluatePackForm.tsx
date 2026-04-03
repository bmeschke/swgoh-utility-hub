import { useRef, useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import type { Doc } from '../../../convex/_generated/dataModel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calcCrystalEquivalent, type PriceCurrency, type ProbabilityTier } from '@/lib/valuations'
import {
  DEFAULT_SAB_TIERS,
  DEFAULT_SAB_DISCOUNTS,
  calcSabAvgCE,
  calcSabTotalPrice,
  type SabTierDraft,
  type SabDiscount,
  DEFAULT_ASCENSION_TIERS,
  calcAscensionTotalCE,
  calcAscensionTotalPrice,
  type AscensionTierDraft,
} from '@/lib/valuations'
import { cn } from '@/lib/utils'
import ItemCombobox, { type ItemComboboxHandle } from './ItemCombobox'
import PackLineItem from './PackLineItem'
import PackValueResult from './PackValueResult'
import SabPackBuilder from './SabPackBuilder'
import AscensionPackBuilder from './AscensionPackBuilder'

export type PackType = 'standard' | 'sab' | 'ascension'

export interface EvalLineItem {
  itemId: string
  name: string
  crystalValue: number
  quantity: number
  tiers?: ProbabilityTier[]
}

interface FormValues {
  items: EvalLineItem[]
  price: string
  priceCurrency: PriceCurrency
}

export default function EvaluatePackForm() {
  const [packType, setPackType] = useState<PackType>('standard')
  const [sabTiers, setSabTiers] = useState<SabTierDraft[]>(DEFAULT_SAB_TIERS)
  const [sabDiscounts, setSabDiscounts] = useState<SabDiscount[]>(DEFAULT_SAB_DISCOUNTS)
  const [ascensionTiers, setAscensionTiers] =
    useState<AscensionTierDraft[]>(DEFAULT_ASCENSION_TIERS)

  const { control, register, watch, setValue } = useForm<FormValues>({
    defaultValues: { items: [], price: '', priceCurrency: 'usd' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = watch('items')
  const watchedPrice = watch('price')
  const priceCurrency = watch('priceCurrency')

  const price = parseFloat(watchedPrice) || 0
  const crystalEquivalent = calcCrystalEquivalent(watchedItems)

  const sabTotalCE = calcSabAvgCE(sabTiers)
  const sabTotalPrice = calcSabTotalPrice(sabTiers)

  const ascensionTotalCE = calcAscensionTotalCE(ascensionTiers)
  const ascensionTotalPrice = calcAscensionTotalPrice(ascensionTiers)

  const showResult =
    packType === 'standard'
      ? watchedItems.length > 0
      : packType === 'sab'
        ? sabTiers.some((t) => t.items.length > 0)
        : ascensionTiers.some((t) => t.items.length > 0)

  const comboboxRef = useRef<ItemComboboxHandle>(null)
  const qtyRefs = useRef<(HTMLInputElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const pendingFocusIndex = useRef<number | null>(null)

  useEffect(() => {
    if (pendingFocusIndex.current !== null) {
      const idx = pendingFocusIndex.current
      pendingFocusIndex.current = null
      rowRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

  return (
    <div className="space-y-6">
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
              <div className="relative">
                {priceCurrency === 'usd' && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                )}
                <Input
                  type="number"
                  min={0}
                  step={priceCurrency === 'usd' ? 0.01 : 1}
                  placeholder={priceCurrency === 'usd' ? '0.00' : 'e.g. 800'}
                  {...register('price')}
                  className={cn('max-w-[160px]', priceCurrency === 'usd' && 'pl-6')}
                />
              </div>
            </div>
          </div>

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
                    rowRef={(el) => {
                      rowRefs.current[index] = el
                    }}
                    onEnter={() => comboboxRef.current?.openAndFocus()}
                  />
                ))}
              </div>
            )}
          </div>
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

      {showResult && (
        <PackValueResult
          packType={packType}
          crystalEquivalent={
            packType === 'standard'
              ? crystalEquivalent
              : packType === 'sab'
                ? sabTotalCE
                : ascensionTotalCE
          }
          price={
            packType === 'standard'
              ? price
              : packType === 'sab'
                ? sabTotalPrice
                : ascensionTotalPrice
          }
          priceCurrency={packType === 'standard' ? priceCurrency : 'usd'}
          items={watchedItems}
          sabTiers={packType === 'sab' ? sabTiers : undefined}
          sabDiscounts={packType === 'sab' ? sabDiscounts : undefined}
          ascensionTiers={packType === 'ascension' ? ascensionTiers : undefined}
        />
      )}
    </div>
  )
}
