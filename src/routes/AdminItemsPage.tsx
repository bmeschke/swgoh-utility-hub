import ItemsTable from '@/features/admin/ItemsTable'

export default function AdminItemsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Items</h1>
      <ItemsTable />
    </div>
  )
}
