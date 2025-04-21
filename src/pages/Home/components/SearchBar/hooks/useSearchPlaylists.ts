import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import type { Category, Playlist } from '@/pages/Home/model/types'

export const useSearchPlaylists = (searchTerm: string, category?: Category, userId?: string) => {
  console.log(' useSearchPlaylists ~ searchTerm: ', searchTerm)
  const pageSize = 10

  return useInfiniteQuery<Playlist[], Error>({
    queryKey: ['playlists', 'search', searchTerm, category, userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!searchTerm.trim()) return []

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

      // 검색어 필터링 (제목, 해시태그에서 검색)
      query = query.or(`title.ilike.%${searchTerm}%,hashtag.cs.{${searchTerm}}`)

      // 카테고리 필터링
      if (category && category !== '전체') {
        query = query.or(`hashtag.is.null,hashtag.cs.{${category}}`)
      }

      // 유저 필터링(본인 제외)
      if (userId) {
        query = query.neq('profile_id', userId)
      }

      const { data, error } = await query

      if (error || !data) throw new Error(error?.message || 'Unknown error')

      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5,
    enabled: !!searchTerm.trim(),
  })
}
