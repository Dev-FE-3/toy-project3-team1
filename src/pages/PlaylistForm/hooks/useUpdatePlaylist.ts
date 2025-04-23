import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'
import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'
import { playlistFormKeys } from '@/pages/PlaylistForm/queries/playlistQueryKeys'
import { playlistService } from '@/pages/PlaylistForm/services/playlistService'
import { useToast } from '@/shared/store/toastStore'
import { useUserStore } from '@/shared/store/userStore'

interface UseUpdatePlaylistFormProps {
  playlistId: string
}

export const useUpdatePlaylistForm = ({ playlistId }: UseUpdatePlaylistFormProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const profileId = useUserStore((s) => s.profileId)
  if (!profileId) throw new Error('로그인이 필요합니다.')

  return useMutation<boolean, Error, PlaylistFormValues>({
    mutationFn: async (data: PlaylistFormValues) => {
      // 1) 기본 정보 업데이트
      await playlistService.updatePlaylist(playlistId, {
        title: data.title,
        description: data.description || null,
        hashtag: data.hashtags.length ? data.hashtags : null,
        is_public: data.isPublic,
      })

      // 2) 아이템 업데이트
      if (data.videos.length) {
        const items = data.videos.map((v, i) => ({
          video_id: v.id,
          title: v.title,
          thumbnail_url: v.thumbnailUrl,
          sort_order: i,
          playlist_id: playlistId,
        }))
        await playlistService.updatePlaylistItems(playlistId, items)
      }

      // 3) 썸네일 처리
      if (data.thumbnail !== undefined) {
        if (data.thumbnail) {
          const url = await playlistService.uploadThumbnail(data.thumbnail, profileId, playlistId)
          await playlistService.updateThumbnailUrl(playlistId, url)
        } else {
          await playlistService.removeThumbnail(profileId, playlistId)
          if (data.videos.length) {
            await playlistService.updateThumbnailUrl(playlistId, data.videos[0].thumbnailUrl)
          }
        }
      }

      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.lists() })
      queryClient.invalidateQueries({ queryKey: playlistCollectionKeys.lists() })
      // 화면 효과
      success('플레이리스트가 성공적으로 수정되었습니다.')
      navigate('/playlists')
    },
    onError: (err: Error) => {
      toastError(err.message)
    },
  })
}
