import { Suspense } from 'react'

import { PlaylistContent, PlaylistLoadingFallback } from '@/pages/PlaylistCollection/components'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

export const PlaylistCollectionPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PlaylistLoadingFallback />}>
        <PlaylistContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default PlaylistCollectionPage
