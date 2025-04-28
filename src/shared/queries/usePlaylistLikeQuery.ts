import { useQuery } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'
import { playlistLikeService } from '../services/playlistLikeServiece'

export const useUserLike = (profile: User | null, playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.userLike(playlistId),
    queryFn: async () => {
      if (!profile) return false

      const isLiked = !!(await playlistLikeService.fetchedUserLikes(profile.id, playlistId))

      return isLiked
    },
    enabled: !!profile && !!playlistId,
  })
}

export const usePlaylistLikeCount = (playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.likeCount(playlistId),
    queryFn: async () => {
      const count = await playlistLikeService.fetchedPlaylistLikes(playlistId)
      return count ?? 0
    },
    enabled: !!playlistId,
  })
}
