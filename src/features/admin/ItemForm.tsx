import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional(),
  crystalValue: z.coerce
    .number({ invalid_type_error: 'Must be a number' })
    .positive('Must be positive'),
})

export type ItemFormValues = z.infer<typeof schema>

interface ItemFormProps {
  defaultValues?: Partial<ItemFormValues>
  onSubmit: (values: ItemFormValues) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function ItemForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input placeholder="Item name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Input placeholder="e.g. Relic Materials" {...register('category')} />
        </div>
        <div className="space-y-1">
          <Label>Crystal value</Label>
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 4"
            {...register('crystalValue')}
          />
          {errors.crystalValue && (
            <p className="text-xs text-destructive">
              {errors.crystalValue.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
