import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import TargetUserPlaylists from './components/TargetUserPlaylists/TargetUserPlaylists'
import { useTargetUserPlaylists } from './hooks/useTargetUserPlaylists'
import ProfilePageHeader from './components/ProfilePageHeader'
import { useTargetUserProfileInfo } from './hooks/useTargetUserProfileInfo'
import ProfilePageSkeleton from './components/ProfilePageSkeleton'

const ProfilePage = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  const targetUserProfileId = paramId ?? profile?.id
  const isMyProfile = !paramId || paramId === profile?.id

  const {
    data: targetUserProfile,
    isLoading: isTargetUserProfileLoading,
    isFetching: isTargetUserProfileFetching,
  } = useTargetUserProfileInfo(targetUserProfileId)

  const {
    data: playlistsWithItems = [],
    isLoading: isTargetUserPlaylistsLoading,
    isFetching: isTargetUserPlaylistsFetching,
  } = useTargetUserPlaylists(targetUserProfileId)

  const isLoading = isTargetUserProfileLoading || isTargetUserPlaylistsLoading
  const isFetching = isTargetUserProfileFetching || isTargetUserPlaylistsFetching

  // useEffect(() => {
  //   // 타겟 유저 ID가 바뀌면 skeleton 다시 보이게
  //   setShowSkeleton(true)
  // }, [targetUserProfileId])

  useEffect(() => {
    if (!isLoading && !isFetching) {
      // 로딩과 페칭이 모두 끝나면 1초 후에 스켈레톤 숨기기
      const timer = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timer)
    }
  }, [targetUserProfileId, isLoading, isFetching]) //`targetUserProfileId`,`isLoading`과 `isFetching` 상태 변경을 감지

  if (!profile || !targetUserProfile) return null

  return (
    <div className="relative h-full">
      {/* Skeleton 애니메이션 (fade out) */}
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            className="absolute inset-0 z-10 bg-white"
            initial={{ opacity: 1 }}
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
        <ProfilePageHeader
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
