import { Suspense } from 'react'

import { FormLoadingFallback, PlaylistFormContent } from '@/pages/PlaylistForm/components'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

export const PlaylistFormPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FormLoadingFallback />}>
        <PlaylistFormContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default PlaylistFormPage
