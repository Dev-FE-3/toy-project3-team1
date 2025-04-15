import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Playlist, PlaylistItem, UpdatePlaylistParams } from '../model/types/types'
import {
  CreatePlaylistItemsParams,
  CreatePlaylistParams,
  UpdateThumbnailUrlParams,
  UploadThumbnailParams,
} from '../model/types/types'
import { playlistService } from '../services/playlistService'

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
