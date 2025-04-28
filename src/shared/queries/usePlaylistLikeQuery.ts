import { useQuery } from '@tanstack/react-query'
import { fetchedPlaylistLikes, fetchedUserLikes } from '../services/playlistLikeServiece'
import { User } from '@supabase/supabase-js'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'

export const useUserLike = (profile: User | null, playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.userLike(playlistId),
    queryFn: async () => {
      if (!profile) return false

      const isLiked = !!(await fetchedUserLikes(profile.id, playlistId))

      return isLiked
    },
    enabled: !!profile && !!playlistId,
  })
}

export const usePlaylistLikeCount = (playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.likeCount(playlistId),
    queryFn: async () => {
      const count = await fetchedPlaylistLikes(playlistId)
      return count ?? 0
    },
    enabled: !!playlistId,
  })
}
