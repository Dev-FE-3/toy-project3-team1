import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import TargetUserPlaylists from './components/TargetUserPlaylists/TargetUserPlaylists' // 타겟 유저의 플레이리스트
import { useTargetUserPlaylists } from './hooks/useTargetUserPlaylists'
import ProfilePageHeader from './components/ProfilePageHeader' // 타겟 유저의 정보와 프로필 편집 버튼 관리 컴포넌트
import { useTargetUserProfileInfo } from './hooks/useTargetUserProfileInfo'

const ProfilePage = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  // 프로필 편집 모달
  const [editModalOpen, setEditModalOpen] = useState(false)

  // 프로필 페이지에서는 로그인한 유저를 타겟으로 설정
  // paramId가 있으면 해당 유저를 타겟을 설정
  const targetUserProfileId = paramId ?? profile?.id

  // 프로필 편집 버튼 분기 처리를 위해서 로그인한 사용자의 프로필 페이지인지 아닌지 구분
  const isMyProfile = !paramId || paramId === profile?.id

  // 타겟 유저의 프로필 정보
  const { data: targetUserProfile } = useTargetUserProfileInfo(targetUserProfileId)

  // 타켓 유저의 플레이리스트
  const { data: playlistsWithItems = [] } = useTargetUserPlaylists(targetUserProfileId)

  if (!profile || !targetUserProfile) return null // 로그인 사용자의 프로필 또는 타겟 프로필 정보가 없을 시 렌더 X

  return (
    <div className="px-[20px] pt-[20px]">
      <ProfilePageHeader
        playlists={playlistsWithItems}
        isMyProfile={isMyProfile}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        targetUserProfile={targetUserProfile}
      />

      <TargetUserPlaylists playlists={playlistsWithItems} />
    </div>
  )
}
export default ProfilePage
