import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PriceCurrency } from '@/lib/valuations'
import type { EvalLineItem } from './EvaluatePackForm'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface SaveToLibraryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: EvalLineItem[]
  price: number
  priceCurrency: PriceCurrency
  crystalEquivalent: number
}

export default function SaveToLibraryDialog({
  open,
  onOpenChange,
  items,
  price,
  priceCurrency,
}: SaveToLibraryDialogProps) {
  const createPack = useMutation(api.packs.create)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    await createPack({
      name: values.name,
      price,
      priceCurrency,
      items: items.map((item) => ({
        itemId: item.itemId as Id<'items'>,
        quantity: item.quantity,
      })),
      notes: values.notes || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Library</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pack-name">Pack name</Label>
            <Input
              id="pack-name"
              placeholder="e.g. Rancor Challenge Pack"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pack-notes">Notes (optional)</Label>
            <Input
              id="pack-notes"
              placeholder="Any additional context..."
              {...register('notes')}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
