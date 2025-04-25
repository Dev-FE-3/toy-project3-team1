// src/pages/Home/components/SearchBar/SearchBar.tsx
import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import SearchBarContent from './components/SearchBarContent'
import { SlideContainer } from '@/shared/components/animations/SlideContainer'
import { useSearchParams } from 'react-router-dom'
import SearchBarHeader from './components/SearchBarHeader'

export const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // 검색어 변경 시 URL 파라미터 업데이트
  const onSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term)

      // URL 파라미터 업데이트
      if (term) {
        searchParams.set('query', term)
      } else {
        searchParams.delete('query')
      }
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams],
  )

  // 검색창 닫기
  const onCloseSearch = useCallback(() => {
    const newParams = new URLSearchParams()
    newParams.delete('search')
    setSearchParams(newParams)
    setSearchTerm('')
  }, [setSearchParams])

  // URL 파라미터 변경 시 검색어 상태 업데이트
  useEffect(() => {
    const query = searchParams.get('query') || ''
    if (query !== searchTerm) {
      setSearchTerm(query)
    }
  }, [searchParams, searchTerm])

  // 디바운스된 검색어로 검색 실행
  // useEffect(() => {
  //   if (debouncedSearchTerm) {
  //     console.log('debouncedSearchTerm', debouncedSearchTerm)
  //   }
  // }, [debouncedSearchTerm])

  return (
    <SlideContainer
      direction="right"
      className="searchbarContainer bg-c900 absolute inset-0 top-0 left-0 z-50 flex h-full flex-col"
    >
      {/* 검색 헤더 컴포넌트 */}
      <SearchBarHeader
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onCloseSearch={onCloseSearch}
      />

      {/* 검색 결과 컴포넌트 */}
      <SearchBarContent searchTerm={searchTerm} />
    </SlideContainer>
  )
}
