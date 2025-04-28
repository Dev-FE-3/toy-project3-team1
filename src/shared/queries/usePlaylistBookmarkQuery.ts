import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'
import { fetchedPlaylistBookmarks, fetchedUserBookmarks } from '../services/playlistBookmarkService'

export const useUserPlaylistBookmark = (profile: User | null, playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.userBookmark(playlistId),
    queryFn: async () => {
      if (!profile) return false

      const isBookmarked = !!(await fetchedUserBookmarks(profile.id, playlistId))

      return isBookmarked
    },
    enabled: !!profile && !!playlistId,
  })
}

export const usePlaylistBookmarkCount = (playlistId: string | undefined) => {
  return useQuery({
    queryKey: LikeBookmarkQueryKeys.bookmarkCount(playlistId),
    queryFn: async () => {
      const count = await fetchedPlaylistBookmarks(playlistId)
      return count ?? 0
    },
    enabled: !!playlistId,
  })
}
