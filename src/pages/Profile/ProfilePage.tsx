import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTargetUserPlaylists } from './hooks/useTargetUserPlaylists'
import { useTargetUserProfileInfo } from './hooks/useTargetUserProfileInfo'
import TargetUserPlaylists from './components/TargetUserPlaylists/TargetUserPlaylists'
import ProfilePageHeader from './components/ProfilePageHeader'
import ProfilePageSkeleton from './components/ProfilePageSkeleton'
import UserNotFound from './components/UserNotFound'

const ProfilePage = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  const targetUserProfileId = paramId ?? profile?.id
  const isMyProfile = !paramId || paramId === profile?.id // 프로필 편집 버튼 분기 처리를 위해 본인 프로필인지 아닌지 구분

  const {
    data: targetUserProfile,
    isLoading: isTargetUserProfileLoading,
    isFetching: isTargetUserProfileFetching,
  } = useTargetUserProfileInfo(targetUserProfileId) // 타겟 유저의 프로필 정보 데이터 관리 훅 : nickname 데이터 추출

  const {
    data: playlistsWithItems = [],
    isLoading: isTargetUserPlaylistsLoading,
    isFetching: isTargetUserPlaylistsFetching,
  } = useTargetUserPlaylists(targetUserProfileId) // 타겟 유저의 플레이리스트 데이터 관리 훅

  const isLoading = isTargetUserProfileLoading || isTargetUserPlaylistsLoading
  const isFetching = isTargetUserProfileFetching || isTargetUserPlaylistsFetching

  useEffect(() => {
    if (!isLoading && !isFetching) {
      // 로딩과 페칭이 모두 끝나면 1초 후에 스켈레톤 숨기기
      const timer = setTimeout(() => setShowSkeleton(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isFetching]) // `isLoading`과 `isFetching` 상태 변경을 감지

  if (!targetUserProfile && !isFetching) {
    return <UserNotFound />
  }

  if (!profile || !targetUserProfile) {
    // 프로필 데이터가 렌더되지 않았을 시
    return <ProfilePageSkeleton />
  }

  return (
    <div className="relative h-full">
      {/* Skeleton 애니메이션 (fade out) */}
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            className="absolute inset-0 z-10 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfilePageSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 콘텐츠 진입 애니메이션 */}
      <motion.div
        className="flex h-full flex-col px-[20px] pt-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSkeleton ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProfilePageHeader // 프로필 페이지 헤더 영역 : 프로필 사진, 이름, 플레이리스트 개수, 프로필 편집 버튼
          playlists={playlistsWithItems}
          isMyProfile={isMyProfile}
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          targetUserProfile={targetUserProfile}
        />

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <TargetUserPlaylists playlists={playlistsWithItems} />
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage
