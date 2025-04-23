import { useTargetUserProfileInfo } from '../../queries/useTargetUserProfileInfo'
import ProfilePageHeader from './ProfilePageHeader'

export const ProfileHeaderSection = ({
  profileId,
  isMyProfile,
  editModalOpen,
  setEditModalOpen,
}: {
  profileId: string | undefined
  isMyProfile: boolean
  editModalOpen: boolean
  setEditModalOpen: (open: boolean) => void
}) => {
  const { data: profileIfo } = useTargetUserProfileInfo(profileId)
  return (
    <ProfilePageHeader
      targetUserProfile={profileIfo}
      playlists={[]} // 여기선 안 써도 됨
      isMyProfile={isMyProfile}
      editModalOpen={editModalOpen}
      setEditModalOpen={setEditModalOpen}
    />
  )
}
