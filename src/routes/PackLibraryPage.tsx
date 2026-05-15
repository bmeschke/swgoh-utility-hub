import PackLibraryList from '@/features/pack-library/PackLibraryList'
import ItemValuesModal from '@/components/ItemValuesModal'

export default function PackLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="flex items-start justify-between gap-x-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Pack Value Library</h1>
          {/* Mobile: description + button on same row */}
          <div className="mt-1 flex items-start justify-between gap-x-4 sm:block">
            <p className="text-sm text-muted-foreground">
              Click any pack to see a full breakdown of its contents and value rating.
            </p>
            <div className="shrink-0 sm:hidden">
              <ItemValuesModal />
            </div>
          </div>
        </div>
        {/* Desktop: button top-aligned with heading */}
        <div className="shrink-0 hidden sm:block">
          <ItemValuesModal />
        </div>
      </div>
      <div className="mt-6">
        <PackLibraryList />
      </div>
    </div>
  )
}
