import { Button } from '@/shared/components/ui/button'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { EditProfileModal } from './modal/EditProfileModal'
import { PlaylistWithItems } from '@/pages/Home/model/types'

// 유저 정보와 프로필 편집 버튼 관리 컴포넌트
const ProfilePageHeader = ({
  isMyProfile,
  editModalOpen,
  setEditModalOpen,
  targetUserProfile,
  playlists,
}: {
  isMyProfile: boolean
  editModalOpen: boolean
  setEditModalOpen: (props: boolean) => void
  targetUserProfile: { nickname: string; id: string }
  playlists: PlaylistWithItems[]
}) => {
  return (
    <>
      <UserCard
        size="medium"
        nickname={targetUserProfile.nickname}
        className="mb-[20px]"
        profileId={targetUserProfile.id}
        listCount={playlists.length}
      />
      {isMyProfile && (
        <>
          <Button
            variant="outline"
            type="button"
            className="bg-c600 text-c200 h-12 w-full"
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
    </>
  )
}

export default ProfilePageHeader
