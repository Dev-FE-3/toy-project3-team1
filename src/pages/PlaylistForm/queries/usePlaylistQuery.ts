import { useMutation } from '@tanstack/react-query'
import {
  CreatePlaylistItemsParams,
  CreatePlaylistParams,
  UpdateThumbnailUrlParams,
  UploadThumbnailParams,
} from '../model/types/types'
import { playlistService } from '../services/playlistApi'

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: (params: CreatePlaylistParams) => playlistService.createPlaylist(params),
  })
}

export const useUploadThumbnail = () => {
  return useMutation({
    mutationFn: (params: UploadThumbnailParams) => playlistService.uploadThumbnail(params),
  })
}

export const useUpdateThumbnailUrl = () => {
  return useMutation({
    mutationFn: (params: UpdateThumbnailUrlParams) => playlistService.updateThumbnailUrl(params),
  })
}

export const useCreatePlaylistItems = () => {
  return useMutation({
    mutationFn: (params: CreatePlaylistItemsParams) =>
      playlistService.createPlaylistItems(params.playlistId, params.videos),
  })
}
