import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search } from 'lucide-react'
import { useSearchPlaylists } from './hooks/useSearchPlaylists'
import { PlaylistContainer } from '../../components/PlaylistContainer'

interface SearchBarResultProps {
  searchTerm: string
  category: string | null
}

export default function SearchBarResult({ searchTerm, category }: SearchBarResultProps) {
  const { profile } = useGetAuthState()
  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetched } =
    useSearchPlaylists(searchTerm, category, profile?.id)

  // 무한 스크롤 로딩
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const playlists = data?.pages.flat() ?? []

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    )
  }

  // 검색어가 없을 때
  if (!searchTerm.trim()) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <Search size={48} className="text-c200 mb-4 opacity-20" />
        <p className="text-c200 text-center">검색어를 입력하여 검색해 보세요.</p>
      </div>
    )
  }

  // 검색 결과가 없을 때
  if (isFetched && playlists.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-c200 text-center">검색 결과가 없습니다.</p>
      </div>
    )
  }

  // 검색 결과 표시
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="px-4 py-2">
        <h2 className="text-lg font-medium text-white">검색 결과</h2>
        <p className="text-c200 text-sm">"{searchTerm}"에 대한 검색 결과</p>
      </div>

      <div className="flex-1">
        <PlaylistContainer playlists={playlists} />
      </div>

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      {/* 무한 스크롤 감지용 요소 */}
      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  )
}
