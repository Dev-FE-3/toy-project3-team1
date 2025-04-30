import { Button } from '@/shared/components/ui/button'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { EditProfileModal } from '../modal/EditProfileModal'

interface ProfilePageHeaderProps {
  isMyProfile: boolean
  editModalOpen: boolean
  setEditModalOpen: (props: boolean) => void
  targetUserProfile: { nickname: string; id: string }
  playlistCount: number | null
}

// 유저 정보와 프로필 편집 버튼 관리 컴포넌트
const ProfilePageHeader = ({
  isMyProfile,
  editModalOpen,
  setEditModalOpen,
  targetUserProfile,
  playlistCount,
}: ProfilePageHeaderProps) => {
  return (
    <div className="mb-[20px]">
      <UserCard
        size="medium"
        nickname={targetUserProfile.nickname}
        className="mb-[10px]"
        profileId={targetUserProfile.id}
        listCount={playlistCount}
      />
      {/* 현재 로그인 중인 사용자의 프로필일 경우 프로필 편집 버튼 활성화 */}
      {isMyProfile && (
        <>
          <Button
            variant="outline"
            type="button"
            className="bg-c600 text-c200 mt-[10px] h-12 w-full"
            onClick={() => setEditModalOpen(true)}
          >
            프로필 편집
          </Button>
          <EditProfileModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            profileId={targetUserProfile.id}
            currentNickname={targetUserProfile.nickname}
          />
        </>
      )}
    </div>
  )
}

export default ProfilePageHeader
