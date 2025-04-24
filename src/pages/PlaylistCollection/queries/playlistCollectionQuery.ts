import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { DBPlaylist } from '@/pages/PlaylistCollection/model'
import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'
import { playlistCollectionService } from '@/pages/PlaylistCollection/services/playlistCollectionService'

export const usePlaylistCollectionInfiniteQuery = (
  profileId: string | null,
  activeKey: string,
  pageSize: number,
) => {
  return useSuspenseInfiniteQuery<DBPlaylist[], Error>({
    queryKey: playlistCollectionKeys.list(profileId, activeKey),
    queryFn: async ({ pageParam = 1 }) => {
      if (!profileId) throw new Error('프로필 ID가 필요합니다')

      return activeKey === 'myPlaylists'
        ? playlistCollectionService.getMyPlaylists(profileId, {
            page: pageParam as number,
            pageSize,
          })
        : playlistCollectionService.getSubscribedPlaylists(profileId, {
            page: pageParam as number,
            pageSize,
          })
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })
}

export const usePlaylistCollectionUnsubscribeMutation = () => {
  return useMutation({
    mutationFn: playlistCollectionService.unsubscribePlaylist,
  })
}
