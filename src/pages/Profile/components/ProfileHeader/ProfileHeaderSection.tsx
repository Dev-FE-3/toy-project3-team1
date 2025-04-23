import { useTargetUserProfileInfo } from '../../queries/useTargetUserProfileInfo'
import ProfilePageHeader from './ProfilePageHeader'
import { useCachedPlaylistCount } from '../../queries/useCahedPlaylistCount'

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
  const playlistCount = useCachedPlaylistCount(profileId)
  console.log(playlistCount)
  return (
    <ProfilePageHeader
      targetUserProfile={profileIfo}
      playlistCount={playlistCount}
      isMyProfile={isMyProfile}
      editModalOpen={editModalOpen}
      setEditModalOpen={setEditModalOpen}
    />
  )
}
