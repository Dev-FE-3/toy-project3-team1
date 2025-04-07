import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { CommentPopup } from '@/features/playlistDetail/CommentPopup/CommentPopup'
import PlaylistInfo from '@/features/playlistDetail/PlaylistInfo/PlaylistInfo'
import AuthorInfo from '@/features/playlistDetail/AuthorInfo/AuthorInfo'
import CommentTrigger from '@/features/playlistDetail/CommentTrigger/CommentTrigger'
import CommentInput from '@/features/playlistDetail/CommentInput/CommentInput'
import CommentList from '@/features/playlistDetail/CommentList/CommentList'
import VideoList from '@/features/playlistDetail/VideoList/VideoList'
import { getPlaylistById, getPlaylistVideos } from '@/shared/model/api/playlist'
import { useAuthContext } from '@/shared/model/contexts/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import VideoPlayer from '@/features/playlistDetail/VideoPlayer/VideoPlayer'
import LoginPrompt from '@/features/playlistDetail/LoginPrompt/LoginPrompt'

const PlaylistDetailPage = () => {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  const { profile, isAuthenticated } = useAuthContext()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const currentPlaylistId = id || 'd276b4f1-d2bf-4325-baab-7ee0dbc314c2'
  const commentPlaylistId = '8575f134-4936-4b6a-a833-395936663775'

  // 플레이리스트 정보 가져오기
  const {
    data: playlistInfo,
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
    error: playlistError,
  } = useQuery({
    queryKey: ['playlistInfo', currentPlaylistId],
    queryFn: () => getPlaylistById(currentPlaylistId),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 "신선"하게 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
  })

  // 플레이리스트에 속한 비디오 목록 가져오기
  const {
    data: videoItems = [],
    isLoading: isVideosLoading,
    isError: isVideosError,
    error: videosError,
  } = useQuery({
    queryKey: ['playlistVideos', currentPlaylistId],
    queryFn: () => getPlaylistVideos(currentPlaylistId),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 "신선"하게 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
  })

  const handleOpenCommentPopup = async () => {
    // 로그인된 경우 댓글 팝업 열기
    setIsCommentPopupOpen(true)
  }

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId)

    setSelectedVideo(videoId)

    // navigate(`/watch?v=${videoId}&list=${currentPlaylistId}`, {
    //   state: {
    //     fromPlaylist: true,
    //     playlistId: currentPlaylistId,
    //     playlistTitle: playlistInfo?.title,
    //   },
    // })
  }

  const handleCommentAdded = () => {
    setRefreshComments((prev) => prev + 1)
  }

  // 로딩 상태 처리
  const isLoading = isPlaylistLoading || isVideosLoading

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-9rem)] flex-col p-4">
        <div className="flex-shrink-0">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="bg-c500 h-[200px] w-full rounded-xl" />
          </AspectRatio>
          <div className="mt-3">
            <Skeleton className="bg-c500 h-5 w-3/4 rounded-md" />
            <Skeleton className="bg-c500 mt-2 h-4 w-1/2 rounded-md" />
          </div>
        </div>
        <div className="mt-4 flex-grow">
          <Skeleton className="bg-c500 h-20 w-full rounded-xl" />
          <Skeleton className="bg-c500 mt-2 h-20 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  // 에러 상태 처리
  const isError = isPlaylistError || isVideosError
  const error = playlistError || videosError
  if (isError) {
    return (
      <div className="flex h-[calc(100vh-9rem)] items-center justify-center p-4">
        <div className="bg-c500 rounded-xl p-6 text-center">
          <p className="text-lg font-medium text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="mt-2 text-slate-300">
            {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
            >
              다시 시도
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            오류가 계속되면 개발 환경에서 Supabase 설정 및 .env 파일을 확인하세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-9rem)] flex-col p-4">
        <div className="flex-shrink-0">
          {selectedVideo ? (
            <VideoPlayer videoId={selectedVideo} />
          ) : (
            <AspectRatio ratio={16 / 9}>
              {playlistInfo?.thumbnail_url ? (
                <img
                  src={playlistInfo.thumbnail_url}
                  alt={playlistInfo.title}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Skeleton className="bg-c500 h-[200px] w-full rounded-xl" />
              )}
            </AspectRatio>
          )}

          {/* 비디오 정보 - 플레이리스트 제목과 설명 표시 */}
          <PlaylistInfo title={playlistInfo?.title} description={playlistInfo?.description} />

          {/* 작성자 정보 */}
          <AuthorInfo
            authorName="오리"
            likeCount={playlistInfo?.likeCount}
            favoriteCount={playlistInfo?.favoriteCount}
          />

          {/* 댓글 트리거 */}
          <CommentTrigger commentCount={100} onClick={handleOpenCommentPopup} />
        </div>

        {/* 플레이리스트 비디오 목록 */}
        <VideoList videos={videoItems} onVideoClick={handleVideoClick} />

        {/* 댓글 팝업 */}
        <CommentPopup open={isCommentPopupOpen} onOpenChange={setIsCommentPopupOpen}>
          <CommentPopup.Header>
            <CommentPopup.Title>댓글</CommentPopup.Title>
          </CommentPopup.Header>
          <CommentPopup.Content>
            {profile && isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <CommentList
                  playlistId={commentPlaylistId}
                  currentProfileId={profile.id}
                  key={refreshComments}
                />
                <CommentInput
                  playlistId={commentPlaylistId}
                  profileId={profile.id}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            ) : (
              <LoginPrompt onLoginClick={handleOpenCommentPopup} />
            )}
          </CommentPopup.Content>
        </CommentPopup>
      </div>
    </>
  )
}

export default PlaylistDetailPage
