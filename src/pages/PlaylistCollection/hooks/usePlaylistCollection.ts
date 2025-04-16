import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { DBPlaylist, Playlist, TabKey } from '@/pages/PlaylistCollection/model'
import {
  playlistKeys,
  usePlaylistInfiniteQuery,
  usePlaylistUnsubscribeMutation,
} from '@/pages/PlaylistCollection/queries/playlistCollectionQueries'

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
  handleUnsubscribe: (playlistId: string) => Promise<void>
}

export const usePlaylistCollection = ({
  profileId,
  pageSize = 12,
}: UsePlaylistCollectionProps): UsePlaylistCollectionReturn => {
  const [activeKey, setActiveKey] = useState<TabKey>('myPlaylists')
  const queryClient = useQueryClient()

  const playlistsQuery = usePlaylistInfiniteQuery(profileId, activeKey, pageSize)
  const unsubscribeMutation = usePlaylistUnsubscribeMutation()

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

  const handleUnsubscribe = async (playlistId: string) => {
    await unsubscribeMutation.mutateAsync(playlistId, {
      onSuccess: () => {
        // 구독 취소 후 플레이리스트 목록 갱신
        queryClient.invalidateQueries({
          queryKey: playlistKeys.list(profileId, activeKey),
        })
      },
    })
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
