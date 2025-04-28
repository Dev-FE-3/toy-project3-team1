import { useInfiniteScroll } from '@/pages/PlaylistCollection/hooks'
import { TabKey } from '@/pages/PlaylistCollection/model'
import { transformPlaylistForUi } from '@/pages/PlaylistCollection/model/utils/transformers'
import {
  usePlaylistCollectionInfiniteQuery,
  usePlaylistCollectionUnsubscribeMutation,
} from '@/pages/PlaylistCollection/queries/playlistCollectionQuery'
import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'
import { useToast } from '@/shared/store/toastStore'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from './Card'
import { CardSkeleton } from './CardSkeleton'

interface CardListProps {
  profileId: string
  activeKey: TabKey
}

export const CardList = ({ profileId, activeKey }: CardListProps) => {
  const queryClient = useQueryClient()
  const playlistsQuery = usePlaylistCollectionInfiniteQuery(profileId, activeKey, 12)
  const unsubscribeMutation = usePlaylistCollectionUnsubscribeMutation()
  const { success, error: showError } = useToast()

  const playlists = playlistsQuery.data?.pages.flat().map(transformPlaylistForUi) ?? []
  const isLoading = playlistsQuery.isLoading || playlistsQuery.isFetching
  const hasMore = playlistsQuery.hasNextPage ?? false
  const error = playlistsQuery.error?.message

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (!isLoading && hasMore && !error) {
        playlistsQuery.fetchNextPage()
      }
    },
    enabled: hasMore && !isLoading && !error,
  })

  const handleUnsubscribe = async (playlistId: string) => {
    try {
      await new Promise<void>((resolve, reject) => {
        unsubscribeMutation.mutate(playlistId, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        })
      })
      queryClient.invalidateQueries({
        queryKey: playlistCollectionKeys.list(profileId, activeKey),
      })
      success('구독이 취소되었습니다.')
    } catch {
      showError('구독 취소 중 오류가 발생했습니다.')
    }
  }

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            id={playlist.id}
            title={playlist.title}
            thumbnailUrl={playlist.thumbnailUrl}
            videoCount={playlist.videoCount}
            isPublic={playlist.isPublic}
            isSubscribed={activeKey === 'subscribedPlaylists'}
            onUnsubscribe={() => handleUnsubscribe(playlist.id)}
          />
        ))}
        {isLoading && hasMore && (
          <>
            {Array.from({ length: 2 }).map((_, idx) => (
              <CardSkeleton key={`loading-${idx}`} />
            ))}
          </>
        )}
      </div>
      {hasMore && <div ref={targetRef} className="h-4" />}
      {!hasMore && playlists.length > 0 && (
        <div className="mt-3 py-4 text-center text-gray-500">
          더 이상 불러올 플레이리스트가 없습니다
        </div>
      )}
      {!hasMore && playlists.length === 0 && (
        <div className="py-4 text-center text-gray-500">플레이리스트가 없습니다</div>
      )}
    </div>
  )
}
