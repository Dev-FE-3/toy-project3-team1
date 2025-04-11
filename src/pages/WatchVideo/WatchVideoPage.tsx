import React, { useEffect, useState } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { useQuery } from '@tanstack/react-query'
import { getPlaylistVideos } from '@/shared/model/api/playlist'
import { getYouTubeVideoDetails } from '@/shared/model/api/youtube'
import { Video } from '@/features/playlistDetail/VideoList/VideoList'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Suspense } from 'react'

interface VideoPlayerProps {
  videoId: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-slate-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  )
}

export default function WatchVideoPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const videoId = searchParams.get('v') || ''
  const playlistId = searchParams.get('list') || ''

  // 유튜브 비디오 정보 가져오기
  const { data: videoDetail, isLoading: isVideoLoading } = useQuery({
    queryKey: ['youtubeVideo', videoId],
    queryFn: () => getYouTubeVideoDetails(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 "신선"하게 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
  })

  // 플레이리스트에 속한 비디오 목록 가져오기
  const { data: videoItems } = useQuery({
    queryKey: ['playlistVideos', playlistId],
    queryFn: () => getPlaylistVideos(playlistId),
    enabled: !!playlistId,
  })

  const [pageInfo, setPageInfo] = useState({
    fromPlaylist: false,
    playlistTitle: '',
    currentPosition: null as Video | null,
    totalVideos: 0,
    currentIndex: 0,
  })

  const isLoading = isVideoLoading && !videoDetail

  // 다른 비디오로 이동하는 함수
  const handleNavigateToVideo = (videoId: string) => {
    navigate(`/watch?v=${videoId}${playlistId ? `&list=${playlistId}` : ''}`, {
      state: location.state,
    })
  }

  // 조회수 포매팅 함수
  const formatViewCount = (viewCount: string) => {
    const count = parseInt(viewCount, 10)
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}만회`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}천회`
    }
    return `${count}회`
  }

  // 날짜 포매팅 함수
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
      return `${diffDays}일 전`
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}주 전`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}개월 전`
    }
    return `${Math.floor(diffDays / 365)}년 전`
  }

  useEffect(() => {
    // 이전 페이지 정보 확인
    const fromPlaylist = Boolean(playlistId) || Boolean(location.state?.fromPlaylist)
    const playlistTitle = location.state?.playlistTitle || '재생목록'

    if (videoItems && videoItems.length > 0) {
      const currentVideo = videoItems.find((item) => item.video_id === videoId) || null
      const currentIndex = currentVideo
        ? videoItems.findIndex((item) => item.video_id === videoId)
        : 0

      setPageInfo({
        fromPlaylist,
        playlistTitle,
        currentPosition: currentVideo,
        totalVideos: videoItems.length,
        currentIndex: currentIndex >= 0 ? currentIndex : 0,
      })
    } else {
      setPageInfo({
        fromPlaylist,
        playlistTitle,
        currentPosition: null,
        totalVideos: 0,
        currentIndex: 0,
      })
    }
  }, [videoId, playlistId, location.state, videoItems, videoDetail])

  return (
    <div className="flex h-full flex-col">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto px-4 py-2">
        <div className="mx-auto max-w-4xl">
          {/* 플레이리스트 정보 표시 */}
          {pageInfo.fromPlaylist && (
            <div className="mb-2 text-sm text-slate-400">
              <span>{pageInfo.playlistTitle}</span>
              <span className="mx-2">•</span>
              <span>
                {pageInfo.currentIndex + 1}/{pageInfo.totalVideos}
              </span>
            </div>
          )}

          {/* 비디오 플레이어 */}
          <Suspense fallback={<Skeleton className="aspect-video w-full rounded-lg" />}>
            <VideoPlayer videoId={videoId} />
          </Suspense>
          {/* {isLoading ? (
            <Skeleton className="aspect-video w-full rounded-lg" />
          ) : videoId ? (
            <VideoPlayer videoId={videoId} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg bg-slate-700">
              <p className="text-slate-400">비디오 ID가 없습니다.</p>
            </div>
          )} */}

          {/* 비디오 정보 */}
          <div className="mt-4 rounded-lg bg-slate-800 p-4">
            {isLoading ? (
              <div>
                <Skeleton className="mb-4 h-6 w-3/4" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-24 w-full" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">
                  {videoDetail?.title || '비디오 제목'}
                </h1>
                <div className="mt-2 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-600"></div>
                  <div className="ml-3">
                    <p className="font-medium text-white">
                      {videoDetail?.channelTitle || '채널명'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {videoDetail
                        ? `조회수 ${formatViewCount(videoDetail.statistics.viewCount)} · ${formatPublishedDate(videoDetail.publishedAt)}`
                        : '조회수 · 업로드 날짜'}
                    </p>
                  </div>
                  {videoDetail && (
                    <div className="ml-auto flex space-x-2">
                      <div className="flex items-center text-sm">
                        <span className="mr-1 text-slate-300">👍</span>
                        <span className="text-slate-300">
                          {formatViewCount(videoDetail.statistics.likeCount)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-1 text-slate-300">💬</span>
                        <span className="text-slate-300">
                          {formatViewCount(videoDetail.statistics.commentCount)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-lg bg-slate-700 p-3">
                  <p className="whitespace-pre-line text-slate-300">
                    {videoDetail?.description || '비디오 설명...'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 플레이리스트 정보 */}
          {playlistId && videoItems && videoItems.length > 0 ? (
            <div className="mt-4 mb-16 rounded-lg bg-slate-800 p-4">
              <h2 className="mb-2 text-lg font-semibold text-white">{pageInfo.playlistTitle}</h2>
              <div className="space-y-2">
                {/* 플레이리스트 아이템 */}
                {videoItems.map((item) => (
                  <div
                    key={item.video_id}
                    className={`mb-2 flex cursor-pointer items-center rounded-lg ${
                      item.video_id === videoId ? 'bg-slate-600' : 'bg-slate-700'
                    } p-2 transition hover:bg-slate-600`}
                    onClick={() => handleNavigateToVideo(item.video_id)}
                  >
                    <div className="h-12 w-20 flex-shrink-0 rounded bg-slate-600">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                    <div className="ml-2 flex-1">
                      <p className="truncate text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">
                        {item.views} · {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : playlistId ? (
            <div className="mt-4 mb-16 rounded-lg bg-slate-800 p-4">
              <Skeleton className="mb-4 h-7 w-36" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center p-2">
                    <Skeleton className="h-12 w-20 rounded" />
                    <div className="ml-2 flex-1">
                      <Skeleton className="mb-2 h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
