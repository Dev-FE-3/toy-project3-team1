import { Suspense } from 'react'
import ProfilePageSkeleton from './components/ProfilePageSkeleton'
import UserNotFound from './components/UserNotFound'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { DeferredComponent } from '@/shared/components/DeferredComponent'
import { ProfilePageContent } from './components/ProfilePageContent'
import { AnimatePresence, motion } from 'framer-motion'

const ProfilePage = () => {
  return (
    <ErrorBoundary fallback={<UserNotFound />}>
      <Suspense
        fallback={
          <DeferredComponent>
            <AnimatePresence mode="wait">
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProfilePageSkeleton />
              </motion.div>
            </AnimatePresence>
          </DeferredComponent>
        }
      >
        <ProfilePageContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default ProfilePage
