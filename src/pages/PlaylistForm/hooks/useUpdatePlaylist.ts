import { useState } from 'react'

import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'
import {
  useRemoveThumbnail,
  useUpdatePlaylist,
  useUpdatePlaylistItems,
  useUpdateThumbnailUrl,
  useUploadThumbnail,
} from '@/pages/PlaylistForm/queries/usePlaylistQuery'
import { useUserStore } from '@/shared/store/userStore'

interface UseUpdatePlaylistFormProps {
  playlistId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useUpdatePlaylistForm = ({
  playlistId,
  onSuccess,
  onError,
}: UseUpdatePlaylistFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<Error | null>(null)
  const { profileId } = useUserStore()

  // Mutations
  const updatePlaylistMutation = useUpdatePlaylist()
  const updatePlaylistItemsMutation = useUpdatePlaylistItems()
  const uploadThumbnailMutation = useUploadThumbnail()
  const removeThumbnailMutation = useRemoveThumbnail()
  const updateThumbnailUrlMutation = useUpdateThumbnailUrl()

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    setUpdateError(new Error(errorMessage))
    onError?.(new Error(errorMessage))
  }

  const updatePlaylist = async (data: PlaylistFormValues) => {
    if (!profileId) {
      handleError(new Error('사용자 정보를 찾을 수 없습니다.'))
      return false
    }

    setIsUpdating(true)
    setUpdateError(null)

    try {
      // 1. 플레이리스트 기본 정보 업데이트
      await updatePlaylistMutation.mutateAsync({
        playlistId,
        params: {
          title: data.title,
          description: data.description || null,
          hashtag: data.hashtags.length > 0 ? data.hashtags : null,
          is_public: data.isPublic,
        },
      })

      // 2. 플레이리스트 아이템 업데이트
      if (data.videos.length > 0) {
        await updatePlaylistItemsMutation.mutateAsync({
          playlistId,
          items: data.videos.map((video, index) => ({
            video_id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailUrl,
            sort_order: index,
            playlist_id: playlistId,
          })),
        })
      }

      // 3. 썸네일 업로드 또는 삭제
      if (typeof data.thumbnail !== 'undefined') {
        if (data.thumbnail) {
          // 새로운 썸네일 업로드
          const thumbnailUrl = await uploadThumbnailMutation.mutateAsync({
            file: data.thumbnail,
            userId: profileId,
            playlistId,
          })

          // 썸네일 URL 업데이트
          await updateThumbnailUrlMutation.mutateAsync({
            playlistId,
            thumbnailUrl,
          })
        } else {
          // 썸네일 삭제
          await removeThumbnailMutation.mutateAsync({
            userId: profileId,
            playlistId,
          })

          // 첫 번째 영상의 썸네일로 업데이트
          if (data.videos.length > 0) {
            await updateThumbnailUrlMutation.mutateAsync({
              playlistId,
              thumbnailUrl: data.videos[0].thumbnailUrl,
            })
          }
        }
      }

      onSuccess?.()
      return true
    } catch (error) {
      handleError(error)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updatePlaylist,
    isUpdating,
    updateError,
  }
}
