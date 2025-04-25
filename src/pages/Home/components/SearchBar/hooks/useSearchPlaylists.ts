import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import type { SelectedTag, Playlist } from '@/pages/Home/model/types'
import { searchbarService } from '../services/searchbarService'

export const useSearchPlaylists = (
  searchTerm: string,
  selectedTag?: SelectedTag,
  userId?: string,
) => {
  const pageSize = 10

  // Suspense 검색 결과 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useSuspenseInfiniteQuery<
    Playlist[],
    Error
  >({
    queryKey: ['searchBar_playlists', 'search', searchTerm, selectedTag, userId],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number

      // searchbarService에 모든 로직 위임
      return searchbarService.searchPlaylistsWithFilters({
        searchTerm: searchTerm.trim() ? searchTerm : undefined,
        hashtag: selectedTag || undefined,
        userId,
        offset,
        pageSize,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    retry: 1,
  })

  // Suspense 버전은 로딩 상태를 반환하지 않음 (suspense 경계에서 처리)
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  }
}
