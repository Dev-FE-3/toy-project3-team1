import { Suspense } from 'react'

import { PlaylistContent } from '@/pages/PlaylistCollection/components'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PageLoadingFallback } from '@/shared/components/PageLoadingFallback/PageLoadingFallback'

export const PlaylistCollectionPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <PlaylistContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default PlaylistCollectionPage
