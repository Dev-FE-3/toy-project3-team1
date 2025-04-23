import TargetUserPlaylists from '../TargetUserPlaylists/TargetUserPlaylists'
import { useTargetUserPlaylists } from '../../queries/useTargetUserPlaylists'

export const PlaylistsSection = ({ profileId }: { profileId: string | undefined }) => {
  const { data: playlists } = useTargetUserPlaylists(profileId)
  return <TargetUserPlaylists playlists={playlists} />
}
