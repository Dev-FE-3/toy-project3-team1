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
            {/* 0.3초 뒤에 스켈레톤 UI 렌더 */}
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
        <ProfilePageContent /> {/* 프로필 콘텐츠를 모아둔 컴포넌트 */}
      </Suspense>
    </ErrorBoundary>
  )
}

export default ProfilePage
