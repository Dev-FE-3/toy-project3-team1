import { useInfiniteScroll } from '@/pages/PlaylistCollection/hooks'
import { Playlist } from '@/pages/PlaylistCollection/model'
import { Card } from './Card'
import { CardSkeleton } from './CardSkeleton'

interface CardListProps {
  playlists: Playlist[]
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  isSubscribedTab?: boolean
  onUnsubscribe?: (playlistId: string) => Promise<void>
  error?: string
}

export const CardList = ({
  playlists,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  isSubscribedTab = false,
  onUnsubscribe,
  error,
}: CardListProps) => {
  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (onLoadMore && !isLoading && !error) {
        onLoadMore()
      }
    },
    enabled: hasMore && !isLoading && !error,
  })

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>
  }

  const handleUnsubscribe = (playlistId: string) => {
    if (onUnsubscribe) {
      return onUnsubscribe(playlistId)
    }
    return Promise.resolve()
  }

  // 초기 로딩 상태일 때 스켈레톤 UI 표시
  if (isLoading && playlists.length === 0) {
    return (
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            <Card
              id={playlist.id}
              title={playlist.title}
              thumbnailUrl={playlist.thumbnailUrl}
              videoCount={playlist.videoCount}
              isPublic={playlist.isPublic}
              isSubscribed={isSubscribedTab}
              onUnsubscribe={() => handleUnsubscribe(playlist.id)}
            />
          </div>
        ))}

        {/* 추가 로딩 시 스켈레톤 표시 */}
        {isLoading && hasMore && (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
              <CardSkeleton key={`loading-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* 무한 스크롤 타겟 */}
      {hasMore && <div ref={targetRef} className="h-4" />}

      {/* 상태 메시지 */}
      {!hasMore && playlists.length > 0 && (
        <div className="py-4 text-center text-gray-500">더 이상 불러올 플레이리스트가 없습니다</div>
      )}
      {!hasMore && playlists.length === 0 && (
        <div className="py-4 text-center text-gray-500">플레이리스트가 없습니다</div>
      )}
    </div>
  )
}
