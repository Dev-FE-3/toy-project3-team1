import React, { useRef, useCallback } from 'react'
import VideoItem from '@/features/playlistDetail/VideoItem/VideoItem'

export interface Video {
  id: string
  video_id: string
  title: string
  thumbnail_url: string
  viewCount: string
  created_at: string
}

interface VideoListProps {
  videos: Video[]
  onVideoClick?: (videoId: string) => void
  className?: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function VideoList({
  videos = [],
  onVideoClick,
  className,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: VideoListProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  // 무한 스크롤을 위한 Intersection Observer 설정
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  // 관찰자 설정
  React.useEffect(() => {
    if (!observerTarget.current || !hasNextPage || !fetchNextPage) return

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 300px 0px', // 마지막 아이템이 뷰포트에 300px 앞에 들어오면 감지
      threshold: 0.1,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [handleObserver, hasNextPage, fetchNextPage])

  // 비디오가 없는 경우
  if (videos.length === 0) {
    return (
      <div className={`mt-4 flex-grow overflow-hidden rounded-xl bg-slate-900 ${className || ''}`}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg text-slate-300">비디오가 없습니다</p>
            <p className="mt-2 text-sm text-slate-400">
              이 플레이리스트에 비디오가 없거나 로드 중 오류가 발생했습니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mt-4 flex-grow overflow-hidden rounded-xl bg-slate-900 ${className || ''}`}>
      <div className="h-full overflow-y-auto p-3">
        <div className="flex flex-col space-y-2">
          {/* 영상 목록 */}
          {videos.map((video) => (
            <VideoItem
              key={video.id}
              title={video.title}
              thumbnail_url={video.thumbnail_url}
              viewCount={video.viewCount}
              created_at={video.created_at}
              onClick={() => onVideoClick?.(video.video_id)}
            />
          ))}

          {/* 로딩 상태 UI */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
              <span className="ml-2 text-slate-300">로딩 중...</span>
            </div>
          )}

          {/* Intersection Observer 타겟 - 무한 스크롤을 위한 포인트 */}
          <div ref={observerTarget} className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}
