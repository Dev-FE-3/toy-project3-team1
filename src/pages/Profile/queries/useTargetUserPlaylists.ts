import { Playlist, VideoItem } from '@/pages/Home/model/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchPlaylistWithItems } from '../services/playlistWithItemsService'
import { profilePageQueryKeys } from './profilePageQueryKeys'

interface Props extends Playlist {
  playlist_items: VideoItem[]
}
export const useTargetUserPlaylists = (targetProfileId?: string) => {
  return useSuspenseQuery<Props[]>({
    queryKey: profilePageQueryKeys.playlists(targetProfileId),
    queryFn: async () => {
      return await fetchPlaylistWithItems(targetProfileId)
    },
    refetchOnWindowFocus: false,
  })
}
