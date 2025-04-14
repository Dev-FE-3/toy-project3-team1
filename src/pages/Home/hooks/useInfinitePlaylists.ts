import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import type { Category, Playlist } from '@/pages/Home/model/types'

export const useInfinitePlaylists = (userId?: string, category?: Category) => {
  const pageSize = 10

  return useInfiniteQuery<Playlist[], Error>({
    queryKey: ['playlists', userId, category],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number

      let query = supabase
        .from('playlists')
        .select(
          `
          *,
          profiles:profile_id (nickname)
          `,
        )
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset * pageSize, offset * pageSize + (pageSize - 1))

      // 본인 제외
      if (userId) {
        query = query.neq('profile_id', userId)
      }

      // 카테고리 필터링
      if (category && category !== '전체') {
        query = query.filter('hashtag', 'cs', `{${category}}`)
      }

      const { data, error } = await query

      if (error || !data) throw new Error(error?.message || 'Unknown error')

      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5,
  })
}
