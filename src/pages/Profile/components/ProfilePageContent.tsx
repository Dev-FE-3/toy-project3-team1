import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useTargetUserPlaylists } from '../queries/useTargetUserPlaylists'
import { useTargetUserProfileInfo } from '../queries/useTargetUserProfileInfo'
import TargetUserPlaylists from './TargetUserPlaylists/TargetUserPlaylists'
import ProfilePageHeader from './ProfilePageHeader'

export const ProfilePageContent = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  const [editModalOpen, setEditModalOpen] = useState(false) // 모달 활성화 여부

  const targetUserProfileId = paramId ?? profile?.id
  const isMyProfile = !paramId || paramId === profile?.id // 프로필 편집 버튼 분기 처리를 위해 본인 프로필인지 아닌지 구분

  const { data: targetUserProfile } = useTargetUserProfileInfo(targetUserProfileId) // 타겟 유저의 프로필 정보 데이터 관리 훅 : nickname 데이터 추출
  const { data: playlistsWithItems = [] } = useTargetUserPlaylists(targetUserProfileId) // 타겟 유저의 플레이리스트 데이터 관리 훅

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col px-5 pt-4">
        <ProfilePageHeader // 프로필 페이지 헤더 영역 : 프로필 사진, 이름, 플레이리스트 개수, 프로필 편집 버튼
          playlists={playlistsWithItems}
          isMyProfile={isMyProfile}
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          targetUserProfile={targetUserProfile}
        />
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <TargetUserPlaylists // 프로필 주인 플레이리스트 렌더
            playlists={playlistsWithItems}
          />
        </div>
      </div>
    </div>
  )
}
