import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { CommentPopup } from '@/pages/PlaylistDetail/components/CommentPopup/CommentPopup'
import PlaylistInfo from '@/pages/PlaylistDetail/components/PlaylistInfo/PlaylistInfo'
import AuthorInfo from '@/pages/PlaylistDetail/components/AuthorInfo/AuthorInfo'
import CommentTrigger from '@/pages/PlaylistDetail/components/CommentTrigger/CommentTrigger'
import CommentInput from '@/pages/PlaylistDetail/components/CommentInput/CommentInput'
import CommentList from '@/pages/PlaylistDetail/components/CommentList/CommentList'
import VideoList from '@/pages/PlaylistDetail/components/VideoList/VideoList'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useParams } from 'react-router-dom'
import VideoPlayer from '@/pages/PlaylistDetail/components/VideoPlayer/VideoPlayer'
import LoginPrompt from '@/pages/PlaylistDetail/components/LoginPrompt/LoginPrompt'
import { getPlaylistById } from '@/shared/model/api/playlist'
import { queryClient } from '@/shared/model/lib/queryClient'
import { fetchMultipleYouTubeVideos } from '@/shared/services/youtubeVideoApi'

export const DEFAULT_PLAYLIST_ID = '44aa498e-a9df-461a-b18e-fed3d0378994'
export const SUB_PLAYLIST_ID = 'd276b4f1-d2bf-4325-baab-7ee0dbc314c2'
export const PRIVATE_PLAYLIST_ID = '44aa498e-a9df-461a-b18e-fed3d0378994'

const PlaylistDetailPage = () => {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
  const { profile, isAuthenticated } = useGetAuthState()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const { id } = useParams()
  const currentPlaylistId = id || SUB_PLAYLIST_ID

  const {
    data: playlistData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['playlist', currentPlaylistId],
    queryFn: async () => {
      const result = await getPlaylistById(currentPlaylistId, profile?.id as string)
      if (!result) {
        throw new Error('플레이리스트를 찾을 수 없습니다.')
      }
      return result
    },
    refetchOnWindowFocus: false,
  })

  const { data: latestYoutubeVideos } = useQuery({
    queryKey: ['latestYoutubeVideos', currentPlaylistId],
    queryFn: async () => {
      const videoIds =
        playlistData?.playlist_items
          .map((item: { video_id: string }) => item.video_id)
          .filter(Boolean) || []

      const result = await fetchMultipleYouTubeVideos(videoIds)
      return result
    },
    enabled: !!playlistData?.playlist_items?.length && !playlistData?.isPrivate, // 플레이리스트가 비공개가 아닐 때만 실행
  })

  const videoItems =
    latestYoutubeVideos?.map((video) => ({
      id: video.id,
      thumbnail_url: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      title: video.snippet.title,
      likeCount: video.statistics.likeCount,
      viewCount: video.statistics.viewCount,
    })) || []

  const playListAuthorProfileId = playlistData?.profile_id

  const handleOpenCommentPopup = async () => {
    // 로그인된 경우 댓글 팝업 열기
    setIsCommentPopupOpen(true)
  }

  // 비디오 클릭 시 비디오 재생
  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  // 댓글 추가
  const handleCommentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', currentPlaylistId] })
  }

  if (isLoading) {
    return (
      <div className="playlistDetailPage flex h-[calc(100vh-9rem)] flex-col p-6">
        <div className="flex-shrink-0">
          <Skeleton className="bg-c500 aspect-video w-full rounded-xl" />
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

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-9rem)] items-center justify-center p-16">
        <div className="bg-c500 rounded-xl p-6 text-center">
          <p className="text-c500 text-lg font-medium">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-c300 mt-2">
            {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-c700 hover:bg-c600 rounded-md px-4 py-2 text-white"
            >
              다시 시도
            </button>
          </div>
          <p className="text-c400 mt-4 text-xs">
            오류가 계속되면 개발 환경에서 Supabase 설정 및 .env 파일을 확인하세요.
          </p>
        </div>
      </div>
    )
  }

  // 비공개 플레이리스트인 경우 간단한 메시지 표시
  if (!playlistData?.is_public) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="bg-c900 rounded-xl p-6 text-center">
          <p className="text-c50 text-lg font-medium">비공개 플레이리스트입니다</p>
          <p className="text-c400 mt-2">이 플레이리스트는 현재 비공개로 설정되어 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="no-scrollbar h-full overflow-y-scroll">
      <div className="flex h-full flex-col px-4">
        <div className="flex-shrink-0">
          {selectedVideo ? (
            // 선택한 비디오 재생
            <VideoPlayer videoId={selectedVideo} />
          ) : (
            // 선택한 비디오가 없을 경우 플레이리스트 썸네일 표시
            <AspectRatio ratio={16 / 9}>
              {playlistData?.thumbnail_url ? (
                <img
                  src={playlistData.thumbnail_url}
                  alt={playlistData.title || '플레이리스트'}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Skeleton className="bg-c500 h-[200px] w-full rounded-xl" />
              )}
            </AspectRatio>
          )}

          {/* 비디오 정보 - 플레이리스트 제목과 설명 표시 */}
          <PlaylistInfo
            title={playlistData?.title || ''}
            description={playlistData?.description || ''}
            isOwner={playlistData?.isOwner}
            createdAt={playlistData?.created_at}
            isPublic={playlistData?.is_public}
            hashTag={playlistData?.hashtag}
            videoCount={playlistData?.playlist_items?.length || 0}
          />

          {/* 작성자 정보 */}
          <AuthorInfo
            ownerId={playlistData.profile_id}
            playlistId={currentPlaylistId}
            authorName={playlistData?.profiles.nickname || ''}
            isOwner={playlistData?.isOwner}
            subscriberCount={playlistData?.subscriber_count || 0}
          />

          {/* 댓글 트리거 */}
          <CommentTrigger
            nickname={profile?.user_metadata?.nickname}
            commentCount={playlistData?.comment_count || 0}
            onToggleCommentPopup={handleOpenCommentPopup}
          />
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
              <div className="contentInside flex h-full flex-col">
                {/* 댓글 목록 영역 */}
                <div className="[&::-webkit-scrollbar-thumb]:bg-c700 [&::-webkit-scrollbar-track]:bg-c800 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
                  <CommentList
                    playlistId={currentPlaylistId}
                    currentProfileId={profile.id}
                    playListAuthorProfileId={playListAuthorProfileId}
                  />
                </div>
                {/* 댓글 입력 영역 */}
                <div className="sticky bottom-0 mt-4">
                  <CommentInput
                    playlistId={currentPlaylistId}
                    profileId={profile.id}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              </div>
            ) : (
              <LoginPrompt onLoginClick={handleOpenCommentPopup} />
            )}
          </CommentPopup.Content>
        </CommentPopup>
      </div>
    </div>
  )
}

export default PlaylistDetailPage
