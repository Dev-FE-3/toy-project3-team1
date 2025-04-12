import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import type { Category, Playlist } from '@/pages/Home/model/types'

export const useInfinitePlaylists = (category?: Category) => {
  const pageSize = 10

  return useInfiniteQuery<Playlist[], Error>({
    queryKey: ['playlists', category],
    queryFn: async ({ pageParam = 0 }: { pageParam?: unknown }) => {
      const offset = pageParam as number
      let query = supabase
        .from('playlists')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset * pageSize, offset * pageSize + (pageSize - 1))

      if (category && category !== '전체') {
        query = query.contains('hashtag', [category])
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
