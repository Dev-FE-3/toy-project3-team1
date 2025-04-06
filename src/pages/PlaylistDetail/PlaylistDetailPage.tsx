import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { CommentPopup } from '@/features/CommentPopup/CommentPopup'
import VideoInfo from '@/features/VideoInfo/VideoInfo'
import AuthorInfo from '@/features/AuthorInfo/AuthorInfo'
import CommentTrigger from '@/features/CommentTrigger/CommentTrigger'
import CommentInput from '@/features/CommentInput/components/CommentInput'
import CommentList from '@/features/CommentList/CommentList'
import VideoList from '@/features/VideoList/VideoList'
import { getPlaylistById, getPlaylistVideos } from '@/shared/model/api/playlist'
import { useAuthContext } from '@/shared/model/contexts/AuthContext'
import { signInWithEmail, refreshSupabaseClient } from '@/shared/model/api/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const PlaylistDetailPage = () => {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  const toyPlaylistId = 'd276b4f1-d2bf-4325-baab-7ee0dbc314c2'
  const playlistId = '8575f134-4936-4b6a-a833-395936663775'
  const { profile, isAuthenticated } = useAuthContext()
  const queryClient = useQueryClient()

  // 플레이리스트 정보 가져오기
  const {
    data: playlistInfo,
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
    error: playlistError,
  } = useQuery({
    queryKey: ['playlistInfo', toyPlaylistId],
    queryFn: () => getPlaylistById(toyPlaylistId),
  })

  // 플레이리스트에 속한 비디오 목록 가져오기
  const {
    data: videoItems = [],
    isLoading: isVideosLoading,
    isError: isVideosError,
    error: videosError,
  } = useQuery({
    queryKey: ['playlistVideos', toyPlaylistId],
    queryFn: () => getPlaylistVideos(toyPlaylistId),
  })

  const handleOpenCommentPopup = async () => {
    // 로그인 여부 확인
    if (!profile || !isAuthenticated) {
      const email = 'toy3@toy3.com'
      const password = '1234qwer!'

      try {
        // 로그인
        const { error } = await signInWithEmail(email, password)
        if (!error) {
          // 로그인 성공 시 클라이언트 재설정
          await refreshSupabaseClient()

          // 약간의 지연 후 쿼리 무효화하여 재
          // setTimeout(() => {
          //   queryClient.invalidateQueries({ queryKey: ['playlistVideos', playlistId] })
          // }, 500)
        }
      } catch (e) {
        console.error('로그인 처리 중 오류:', e)
      }
      return
    }

    // 로그인된 경우 댓글 팝업 열기
    setIsCommentPopupOpen(true)
  }

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId)
  }

  const handleCommentAdded = () => {
    setRefreshComments((prev) => prev + 1)
  }

  // useEffect(() => {
  //   console.log('playlistInfo', playlistInfo)
  //   setTimeout(() => {
  //     refreshSupabaseClient()
  //   }, 500)
  // }, [])

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
          {/* 플레이리스트 썸네일 */}
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

          {/* 비디오 정보 - 플레이리스트 제목과 설명 표시 */}
          <VideoInfo title={playlistInfo?.title} description={playlistInfo?.description} />

          {/* 작성자 정보 */}
          <AuthorInfo />

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
                  playlistId={playlistId}
                  currentProfileId={profile.id}
                  key={refreshComments}
                />
                <CommentInput
                  playlistId={playlistId}
                  profileId={profile.id}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 p-4">
                <p className="text-center text-slate-300">댓글을 작성하려면 로그인이 필요합니다.</p>
                <button
                  onClick={handleOpenCommentPopup}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  로그인하기
                </button>
              </div>
            )}
          </CommentPopup.Content>
        </CommentPopup>
      </div>
    </>
  )
}

export default PlaylistDetailPage
