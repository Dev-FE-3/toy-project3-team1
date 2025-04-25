import React from 'react'
import BackButton from './BackButton'
import SearchInput from './SearchInput'

interface Props {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onCloseSearch: () => void
}

/**
 * 검색바 상단 헤더 컴포넌트
 * 뒤로가기 버튼과 검색 입력 필드를 포함
 */
const SearchBarHeader = ({ searchTerm, onSearchTermChange, onCloseSearch }: Props) => {
  return (
    <div className="border-c800 flex items-center gap-3 p-4">
      {/* 뒤로 가기 버튼 */}
      <BackButton onCloseSearch={onCloseSearch} />

      {/* 검색 입력 창 */}
      <SearchInput searchTerm={searchTerm} onSearchTermChange={onSearchTermChange} />
    </div>
  )
}

export default SearchBarHeader
