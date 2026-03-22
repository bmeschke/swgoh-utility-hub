import PackLibraryList from '@/features/pack-library/PackLibraryList'

export default function PackLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Pack Value Library</h1>
      <PackLibraryList />
    </div>
  )
}
