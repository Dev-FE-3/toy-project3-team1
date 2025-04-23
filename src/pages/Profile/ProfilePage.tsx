import { Suspense } from 'react'
import ProfilePageSkeleton from './components/ProfilePageSkeleton'
import UserNotFound from './components/UserNotFound'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { ProfilePageContent } from './components/ProfilePageContent'
import SkeletonAnimation from '@/shared/components/SkeletonAnimation'

const ProfilePage = () => {
  return (
    <ErrorBoundary fallback={<UserNotFound />}>
      <Suspense fallback={<SkeletonAnimation children={<ProfilePageSkeleton />} />}>
        <ProfilePageContent /> {/* 프로필 콘텐츠를 모아둔 컴포넌트 */}
      </Suspense>
    </ErrorBoundary>
  )
}

export default ProfilePage
