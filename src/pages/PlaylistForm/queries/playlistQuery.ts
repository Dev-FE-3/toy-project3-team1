import { playlistFormKeys } from '@/pages/PlaylistForm/queries/playlistQueryKeys'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

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
export const useCreatePlaylistMutation = () => {
  return useMutation({
    mutationFn: (params: CreatePlaylistParams) => playlistService.createPlaylist(params),
  })
}

// === 썸네일 업로드 ===
export const useUploadThumbnailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UploadThumbnailParams) =>
      playlistService.uploadThumbnail(params.file, params.userId, params.playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 썸네일 삭제 ===
export const useDeleteThumbnailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, playlistId }: { userId: string; playlistId: string }) =>
      playlistService.deleteThumbnail(userId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 썸네일 URL 업데이트 ===
export const useUpdateThumbnailUrlMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateThumbnailUrlParams) =>
      playlistService.updateThumbnailUrl(params.playlistId, params.thumbnailUrl),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 썸네일 제거 ===
export const useRemoveThumbnailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, playlistId }: { userId: string; playlistId: string }) =>
      playlistService.removeThumbnail(userId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 썸네일 초기화 ===
export const useResetThumbnailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, userId }: { playlistId: string; userId: string }) =>
      playlistService.resetThumbnail(playlistId, userId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 플레이리스트 조회 ===
export const useGetPlaylistQuery = (playlistId: string) => {
  return useSuspenseQuery<Playlist>({
    queryKey: playlistFormKeys.detail(playlistId),
    queryFn: () => playlistService.getPlaylist(playlistId),
  })
}

// === 플레이리스트 수정 ===
export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, params }: { playlistId: string; params: UpdatePlaylistParams }) =>
      playlistService.updatePlaylist(playlistId, params),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 플레이리스트 아이템 수정 ===
export const useUpdatePlaylistItemsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, items }: { playlistId: string; items: PlaylistItem[] }) =>
      playlistService.updatePlaylistItems(playlistId, items),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 플레이리스트 아이템 생성 ===
export const useCreatePlaylistItemsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreatePlaylistItemsParams) =>
      playlistService.createPlaylistItems(params.playlistId, params.videos),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.detail(playlistId) })
    },
  })
}

// === 썸네일 업데이트 ===
export const useUpdateThumbnailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { file: File; userId: string; playlistId: string }) =>
      playlistService.updatePlaylistThumbnail(params.file, params.userId, params.playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistFormKeys.lists() })
    },
  })
}
