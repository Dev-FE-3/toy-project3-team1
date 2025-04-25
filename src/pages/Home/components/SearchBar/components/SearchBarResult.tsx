import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search } from 'lucide-react'
import { useSearchPlaylists } from '../hooks/useSearchPlaylists'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import SearchLoadingUI from './SearchLoadingUI'
interface SearchBarResultProps {
  searchTerm: string
  selectedTag: string | null
}

export default function SearchBarResult({ searchTerm, selectedTag }: SearchBarResultProps) {
  const { profile } = useGetAuthState()
  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchPlaylists(
    searchTerm,
    selectedTag,
    profile?.id,
  )
  const playlists = data.pages.flat() ?? []

  // 무한 스크롤 로딩
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 검색어가 없을 때
  if (!searchTerm.trim() && playlists.length === 0) {
    return <SearchPrompt />
  }

  // 검색 결과가 없을 때
  if (playlists.length === 0) {
    return <NoSearchResult />
  }

  // 검색 결과 표시
  return (
    <div className="searchBarResult flex min-h-[calc(100vh-240px)] flex-1 flex-col overflow-auto">
      {!selectedTag && (
        <div className="px-4 py-2">
          <h2 className="text-lg font-medium text-white">검색 결과</h2>
          <p className="text-c200 text-sm">"{searchTerm}"에 대한 검색 결과</p>
        </div>
      )}

      <div className="flex-1">
        <PlaylistContainer playlists={playlists} />
      </div>

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && <SearchLoadingUI />}

      {/* 무한 스크롤 감지용 요소 */}
      <div ref={loadMoreRef} style={{ height: 1 }} className="mb-[70px]" />
    </div>
  )
}

// 검색어를 입력 안내 프롬프트
const SearchPrompt = () => {
  return (
    <div className="flex min-h-[calc(100vh-180px)] flex-1 flex-col items-center justify-center p-4">
      <Search size={48} className="text-c200 mb-4 opacity-20" />
      <p className="text-c200 text-center">검색어를 입력하여 검색해 보세요.</p>
    </div>
  )
}

// 검색 결과가 없을 때
const NoSearchResult = () => {
  return (
    <div className="flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center p-4">
      <p className="text-c200 text-center">검색 결과가 없습니다.</p>
    </div>
  )
}
