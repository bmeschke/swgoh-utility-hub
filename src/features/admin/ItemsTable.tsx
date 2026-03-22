import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, DatabaseIcon } from 'lucide-react'
import ItemForm from './ItemForm'
import type { ItemFormValues } from './ItemForm'

type EditingState = { type: 'new' } | { type: 'edit'; id: Id<'items'> } | null

export default function ItemsTable() {
  const items = useQuery(api.items.listAll)
  const createItem = useMutation(api.items.create)
  const updateItem = useMutation(api.items.update)
  const toggleActive = useMutation(api.items.toggleActive)
  const triggerSeed = useMutation(api.items.triggerSeed)

  const [editing, setEditing] = useState<EditingState>(null)
  const [seedError, setSeedError] = useState<string | null>(null)

  if (items === undefined) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (items === null) {
    return <p className="text-muted-foreground">Not authorized or not authenticated to Convex.</p>
  }

  async function handleCreate(values: ItemFormValues) {
    await createItem({
      name: values.name,
      category: values.category || undefined,
      crystalValue: values.crystalValue,
    })
    setEditing(null)
  }

  async function handleUpdate(id: Id<'items'>, values: ItemFormValues) {
    await updateItem({
      id,
      name: values.name,
      category: values.category || undefined,
      crystalValue: values.crystalValue,
    })
    setEditing(null)
  }

  async function handleSeed() {
    setSeedError(null)
    try {
      await triggerSeed({})
    } catch (err) {
      setSeedError(err instanceof Error ? err.message : String(err))
    }
  }

  const editingItem =
    editing?.type === 'edit'
      ? items.find((i) => i._id === editing.id)
      : undefined

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} items</p>
        <div className="flex gap-2">
          {items.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeed}
            >
              <DatabaseIcon className="size-4" />
              Seed Items
            </Button>
          )}
          <Button size="sm" onClick={() => setEditing({ type: 'new' })}>
            <PlusIcon className="size-4" />
            Add Item
          </Button>
        </div>
      </div>

      {seedError && (
        <p className="text-sm text-destructive">{seedError}</p>
      )}

      {editing?.type === 'new' && (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-3">New Item</p>
          <ItemForm
            onSubmit={handleCreate}
            onCancel={() => setEditing(null)}
            submitLabel="Add Item"
          />
        </div>
      )}

      {editing?.type === 'edit' && editingItem && (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-3">Edit: {editingItem.name}</p>
          <ItemForm
            defaultValues={{
              name: editingItem.name,
              category: editingItem.category,
              crystalValue: editingItem.crystalValue,
            }}
            onSubmit={(values) => handleUpdate(editingItem._id, values)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Crystal Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-8"
              >
                No items yet. Add one above or seed from the items file.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.category ?? '—'}
                </TableCell>
                <TableCell>{item.crystalValue}✦</TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'default' : 'outline'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5 justify-end">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setEditing({ type: 'edit', id: item._id })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => toggleActive({ id: item._id })}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
