import PackLibraryList from '@/features/pack-library/PackLibraryList'

export default function PackLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Pack Value Library</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Click any pack to see a full breakdown of its contents and value rating.
      </p>
      <PackLibraryList />
    </div>
  )
}
