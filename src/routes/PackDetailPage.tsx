import { useParams } from 'react-router-dom'
import type { Id } from '../../convex/_generated/dataModel'
import PackDetail from '@/features/pack-library/PackDetail'

export default function PackDetailPage() {
  const { packId } = useParams<{ packId: string }>()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PackDetail packId={packId as Id<'packs'>} />
    </div>
  )
}
