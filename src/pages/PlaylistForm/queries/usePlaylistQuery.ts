import { playlistKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueries'
import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'
import { useUserStore } from '@/shared/store/userStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  Playlist,
  PlaylistItem,
  UpdatePlaylistParams,
} from '@/pages/PlaylistForm/model/types/types'
import {
  CreatePlaylistItemsParams,
  CreatePlaylistParams,
  UpdateThumbnailUrlParams,
  UploadThumbnailParams,
} from '@/pages/PlaylistForm/model/types/types'
import { playlistService } from '@/pages/PlaylistForm/services/playlistService'

// === 플레이리스트 생성 ===
export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: (params: CreatePlaylistParams) => playlistService.createPlaylist(params),
  })
}

// === 썸네일 업로드 ===
export const useUploadThumbnail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UploadThumbnailParams) =>
      playlistService.uploadThumbnail(params.file, params.userId, params.playlistId),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 썸네일 삭제 ===
export const useDeleteThumbnail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, playlistId }: { userId: string; playlistId: string }) =>
      playlistService.deleteThumbnail(userId, playlistId),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 썸네일 URL 업데이트 ===
export const useUpdateThumbnailUrl = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateThumbnailUrlParams) =>
      playlistService.updateThumbnailUrl(params.playlistId, params.thumbnailUrl),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 썸네일 제거 ===
export const useRemoveThumbnail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, playlistId }: { userId: string; playlistId: string }) =>
      playlistService.removeThumbnail(userId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 썸네일 초기화 ===
export const useResetThumbnail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, userId }: { playlistId: string; userId: string }) =>
      playlistService.resetThumbnail(playlistId, userId),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 플레이리스트 조회 ===
export const useGetPlaylist = (playlistId: string) => {
  return useQuery<Playlist>({
    queryKey: ['playlist', playlistId],
    queryFn: () => playlistService.getPlaylist(playlistId),
    enabled: !!playlistId,
  })
}

// === 플레이리스트 수정 ===
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, params }: { playlistId: string; params: UpdatePlaylistParams }) =>
      playlistService.updatePlaylist(playlistId, params),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 플레이리스트 아이템 수정 ===
export const useUpdatePlaylistItems = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, items }: { playlistId: string; items: PlaylistItem[] }) =>
      playlistService.updatePlaylistItems(playlistId, items),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 플레이리스트 아이템 생성 ===
export const useCreatePlaylistItems = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreatePlaylistItemsParams) =>
      playlistService.createPlaylistItems(params.playlistId, params.videos),
    onSuccess: (_, { playlistId }) => {
      // 플레이리스트 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

// === 썸네일 업데이트 ===
export const useUpdateThumbnail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { file: File; userId: string; playlistId: string }) =>
      playlistService.updatePlaylistThumbnail(params.file, params.userId, params.playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

// === 썸네일 업로드 또는 삭제 ===
export const useUploadOrDeleteThumbnail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { file: File | null; userId: string; playlistId: string }) =>
      playlistService.uploadOrDeleteThumbnail(params.file, params.userId, params.playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
    },
  })
}

export const useSubmitPlaylistMutation = () => {
  const queryClient = useQueryClient()
  const createPlaylistMutation = useCreatePlaylist()
  const createPlaylistItemsMutation = useCreatePlaylistItems()
  const uploadThumbnailMutation = useUploadThumbnail()
  const updateThumbnailUrlMutation = useUpdateThumbnailUrl()

  return useMutation({
    mutationFn: async (data: PlaylistFormValues) => {
      const profileId = useUserStore.getState().profileId
      if (!profileId) throw new Error('사용자 정보를 찾을 수 없습니다.')

      // 1. 플레이리스트 생성
      const newPlaylist = await createPlaylistMutation.mutateAsync({
        title: data.title,
        description: data.description || null,
        profile_id: profileId,
        is_public: data.isPublic,
        hashtag: data.hashtags.length ? data.hashtags : undefined,
        thumbnail_url: null,
      })

      // 2. 플레이리스트 아이템 생성
      await createPlaylistItemsMutation.mutateAsync({
        playlistId: newPlaylist.id,
        videos: data.videos,
      })

      // 3. 썸네일 처리
      if (data.thumbnail) {
        // 썸네일 업로드
        const thumbnailUrl = await uploadThumbnailMutation.mutateAsync({
          file: data.thumbnail,
          userId: profileId,
          playlistId: newPlaylist.id,
        })
        // 썸네일 URL 업데이트
        await updateThumbnailUrlMutation.mutateAsync({
          playlistId: newPlaylist.id,
          thumbnailUrl,
        })
      } else if (data.videos.length > 0) {
        await updateThumbnailUrlMutation.mutateAsync({
          playlistId: newPlaylist.id,
          thumbnailUrl: data.videos[0].thumbnailUrl,
        })
      }

      return newPlaylist
    },
    onSuccess: () => {
      // 플레이리스트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: playlistKeys.lists(),
      })
    },
  })
}
