import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import type { Category } from '@/pages/Home/model/types'
import { playlistService } from '../services/playlistService'

const PAGE_SIZE = 10

export const useInfinitePlaylists = (userId?: string, category?: Category) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['playlists', category],
    queryFn: ({ pageParam = 0 }) =>
      playlistService.fetchPlaylists(pageParam, PAGE_SIZE, userId, category),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.playlists.length === PAGE_SIZE ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 1,
  })
}
