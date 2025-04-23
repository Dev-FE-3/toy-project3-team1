import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'
import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'
import { playlistFormKeys } from '@/pages/PlaylistForm/queries/playlistQueryKeys'
import { playlistService } from '@/pages/PlaylistForm/services/playlistService'
import { useToast } from '@/shared/store/toastStore'
import { useUserStore } from '@/shared/store/userStore'

export const useSubmitPlaylist = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const profileId = useUserStore((s) => s.profileId)
  if (!profileId) throw new Error('로그인이 필요합니다.')

  const validatePlaylist = (data: PlaylistFormValues) => {
    const errors: string[] = []

    if (!data.title.trim()) {
      errors.push('제목을 입력해주세요.')
    }

    if (data.title.length > 20) {
      errors.push('제목은 20자를 초과할 수 없습니다.')
    }

    if (data.description && data.description.length > 150) {
      errors.push('설명은 150자를 초과할 수 없습니다.')
    }

    if (data.hashtags.length > 3) {
      errors.push('해시태그는 최대 3개까지만 등록 가능합니다.')
    }

    if (data.videos.length === 0) {
      errors.push('최소 1개 이상의 영상을 등록해주세요.')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  return {
    validatePlaylist,
    ...useMutation<boolean, Error, PlaylistFormValues>({
      mutationFn: async (data: PlaylistFormValues) => {
        // 1. 플레이리스트 생성
        const newPlaylist = await playlistService.createPlaylist({
          title: data.title,
          description: data.description || null,
          profile_id: profileId,
          is_public: data.isPublic,
          hashtag: data.hashtags.length ? data.hashtags : undefined,
          thumbnail_url: null,
        })

        // 2. 플레이리스트 아이템 생성
        if (data.videos.length > 0) {
          await playlistService.createPlaylistItems(newPlaylist.id, data.videos)
        }

        // 3. 썸네일 처리
        if (data.thumbnail) {
          // 썸네일 업로드
          const thumbnailUrl = await playlistService.uploadThumbnail(
            data.thumbnail,
            profileId,
            newPlaylist.id,
          )

          // 썸네일 URL 업데이트
          await playlistService.updateThumbnailUrl(newPlaylist.id, thumbnailUrl)
        } else if (data.videos.length > 0) {
          await playlistService.updateThumbnailUrl(newPlaylist.id, data.videos[0].thumbnailUrl)
        }

        return true
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: playlistFormKeys.lists() })
        queryClient.invalidateQueries({ queryKey: playlistCollectionKeys.lists() })

        // 화면 효과
        toastSuccess('플레이리스트가 성공적으로 생성되었습니다.')
        navigate('/playlists')
      },
      onError: (err: Error) => {
        toastError(err.message)
      },
    }),
  }
}
