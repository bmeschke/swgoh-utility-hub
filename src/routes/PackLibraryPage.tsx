import PackLibraryList from '@/features/pack-library/PackLibraryList'
import ItemValuesModal from '@/components/ItemValuesModal'

export default function PackLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
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
