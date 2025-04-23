import { useTargetUserPlaylists } from '../../queries/useTargetUserPlaylists'
import TargetUserPlaylists from '../TargetUserPlaylists/TargetUserPlaylists'

export const PlaylistsSection = ({ profileId }: { profileId: string | undefined }) => {
  const { data: playlists } = useTargetUserPlaylists(profileId)
  return <TargetUserPlaylists playlists={playlists} />
}
