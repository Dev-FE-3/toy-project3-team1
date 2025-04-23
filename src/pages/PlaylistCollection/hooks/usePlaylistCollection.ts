import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { DBPlaylist, Playlist, TabKey } from '@/pages/PlaylistCollection/model'
import {
  usePlaylistCollectionInfiniteQuery,
  usePlaylistCollectionUnsubscribeMutation,
} from '@/pages/PlaylistCollection/queries/playlistCollectionQuery'
import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'

interface UsePlaylistCollectionProps {
  profileId: string | null
  pageSize?: number
}

interface UsePlaylistCollectionReturn {
  playlists: Playlist[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  activeKey: TabKey
  setActiveKey: (key: TabKey) => void
  handleLoadMore: () => void
  handleUnsubscribe: (playlistId: string) => void
}

export const usePlaylistCollection = ({
  profileId,
  pageSize = 12,
}: UsePlaylistCollectionProps): UsePlaylistCollectionReturn => {
  const [activeKey, setActiveKey] = useState<TabKey>('myPlaylists')
  const queryClient = useQueryClient()

  const playlistsQuery = usePlaylistCollectionInfiniteQuery(profileId, activeKey, pageSize)
  const unsubscribeMutation = usePlaylistCollectionUnsubscribeMutation()

  const playlists =
    playlistsQuery.data?.pages.flat().map((playlist: DBPlaylist) => ({
      id: playlist.id,
      title: playlist.title,
      thumbnailUrl: playlist.thumbnail_url,
      videoCount: playlist.playlist_items[0]?.count ?? 0,
      isPublic: playlist.is_public,
    })) ?? []
  const isLoading = playlistsQuery.isLoading || playlistsQuery.isFetching
  const error = playlistsQuery.error?.message ?? null
  const hasMore = playlistsQuery.hasNextPage ?? false

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      playlistsQuery.fetchNextPage()
    }
  }

  const handleUnsubscribe = async (playlistId: string): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        unsubscribeMutation.mutate(playlistId, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        })
      })

      queryClient.invalidateQueries({
        queryKey: playlistCollectionKeys.list(profileId, activeKey),
      })
    } catch (error) {
      console.error('구독 취소 중 오류가 발생했습니다:', error)
      throw error
    }
  }

  return {
    playlists,
    isLoading,
    error,
    hasMore,
    activeKey,
    setActiveKey,
    handleLoadMore,
    handleUnsubscribe,
  }
}
