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
      const { thumbnail, thumbnailUrl } = data
      // Supabase 스토리지에 업로드된 썸네일인지 확인
      const isExistingStorageThumbnail = !!thumbnailUrl?.includes(
        'storage/v1/object/public/images/playlist',
      )

      if (thumbnail) {
        // 새로운 파일 업로드
        const url = await playlistService.uploadThumbnail(thumbnail, profileId, playlistId)
        await playlistService.updateThumbnailUrl(playlistId, url)
      } else if (!isExistingStorageThumbnail) {
        // 유튜브 썸네일이거나 제거 요청된 경우: 저장소 파일 삭제 후 첫 비디오 썸네일로 설정
        await playlistService.removeThumbnail(profileId, playlistId)
        if (data.videos.length) {
          await playlistService.updateThumbnailUrl(playlistId, data.videos[0].thumbnailUrl)
        }
      }

      return true
    },
    onSuccess: () => {
      // 플레이리스트 목록 및 컬렉션 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.lists() })
      queryClient.invalidateQueries({ queryKey: playlistCollectionKeys.lists() })
      // 상세 조회 쿼리도 무효화하여 수정 후 다시 fetch
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
      // 화면 효과
      success('플레이리스트가 성공적으로 수정되었습니다.')
      navigate('/playlists')
    },
    onError: (err: Error) => {
      toastError(err.message)
    },
  })
}
