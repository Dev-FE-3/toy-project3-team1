import { useQuery } from '@tanstack/react-query'
import { fetchedPlaylistLikes, fetchedUserLikes } from '../services/playlistLikeServiece'
import { User } from '@supabase/supabase-js'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'

export const usefetchLikes = (profile: User | null, playlistId: string | undefined) => {
  return useQuery({
    queryKey: [LikeBookmarkQueryKeys.like(playlistId)],
    queryFn: async () => {
      if (!profile) return { isLiked: false, likeCount: 0 }

      const isLiked = !!(await fetchedUserLikes(profile.id, playlistId))

      const count = await fetchedPlaylistLikes(playlistId)

      return { isLiked, likeCount: count || 0 }
    },
    enabled: !!profile && !!playlistId,
  })
}
