import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Suspense, useState } from 'react'
import { ProfileHeaderSection } from './components/ProfileHeader/ProfileHeaderSection'
import { useParams } from 'react-router-dom'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { PlaylistsSection } from './components/PlaylistSection/PlaylistSection'
import { PlaylistSkeleton, ProfileHeaderSkeleton } from './components/skeletons/ProfilePageSkeleton'
import UserNotFound from './components/UserNotFound'
import SkeletonAnimation from '@/shared/components/SkeletonAnimation'

export const ProfilePage = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  const [editModalOpen, setEditModalOpen] = useState(false)

  const targetUserProfileId = paramId ?? profile?.id
  const isMyProfile = !paramId || paramId === profile?.id

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col px-5 pt-4">
        {/* 프로필 정보 로딩 별도 처리 */}
        <ErrorBoundary fallback={<UserNotFound />} key={targetUserProfileId}>
          <Suspense fallback={<SkeletonAnimation children={<ProfileHeaderSkeleton />} />}>
            <ProfileHeaderSection
              profileId={targetUserProfileId}
              isMyProfile={isMyProfile}
              editModalOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
            />
          </Suspense>
          {/* 플레이리스트 로딩 별도 처리 */}
          <div className="no-scrollbar mt-4 flex-1 overflow-y-auto">
            <Suspense fallback={<SkeletonAnimation children={<PlaylistSkeleton />} />}>
              <PlaylistsSection profileId={targetUserProfileId} />
            </Suspense>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  )
}
