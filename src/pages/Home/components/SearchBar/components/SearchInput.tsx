import React from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
}

/**
 * 검색 입력 필드 컴포넌트
 */
const SearchInput = ({ searchTerm, onSearchTermChange }: SearchInputProps) => {
  return (
    <div className="relative flex flex-1">
      <Search className="text-c200 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder="검색어를 입력해주세요."
        className="bg-c800 h-12 w-full rounded-full pr-4 pl-12 text-white outline-none"
        autoFocus
      />
    </div>
  )
}

export default SearchInput
