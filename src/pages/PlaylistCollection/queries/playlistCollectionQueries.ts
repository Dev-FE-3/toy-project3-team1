import { useInfiniteQuery, useMutation } from '@tanstack/react-query'

import { DBPlaylist } from '@/pages/PlaylistCollection/model'
import { playlistCollectionService } from '@/pages/PlaylistCollection/services/playlistCollectionService'

export const playlistKeys = {
  all: ['playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (profileId: string | null, activeKey: string) =>
    [...playlistKeys.lists(), profileId, activeKey] as const,
}

export const usePlaylistInfiniteQuery = (
  profileId: string | null,
  activeKey: string,
  pageSize: number,
) => {
  return useInfiniteQuery<DBPlaylist[], Error>({
    queryKey: playlistKeys.list(profileId, activeKey),
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
    enabled: !!profileId,
    initialPageParam: 1,
  })
}

export const usePlaylistUnsubscribeMutation = () => {
  return useMutation({
    mutationFn: playlistCollectionService.unsubscribePlaylist,
  })
}
