import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'
import {
  fetchedPlaylistBookmarks,
  fetchedUserBookmarkes,
} from '../services/playlistBookmarkService'

export const usefetchBookmarks = (profile: User | null, playlistId: string | undefined) => {
  return useQuery({
    queryKey: [LikeBookmarkQueryKeys.bookmark(playlistId)],
    queryFn: async () => {
      if (!profile) return { isBookmarked: false, bookmarkCount: 0 }

      const isBookmarked = !!(await fetchedUserBookmarkes(profile.id, playlistId))

      const count = await fetchedPlaylistBookmarks(playlistId)

      return { isBookmarked, bookmarkCount: count || 0 }
    },
    enabled: !!profile && !!playlistId,
  })
}
