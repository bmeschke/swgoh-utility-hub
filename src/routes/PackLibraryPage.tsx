import PackLibraryList from '@/features/pack-library/PackLibraryList'
import ItemValuesModal from '@/components/ItemValuesModal'

export default function PackLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pack Value Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click any pack to see a full breakdown of its contents and value rating.
          </p>
        </div>
        <ItemValuesModal />
      </div>
      <div className="mt-6">
        <PackLibraryList />
      </div>
    </div>
  )
}
