// src/pages/Home/components/SearchBar/SearchBar.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import SearchBarContent from './SearchBarContent'

interface SearchBarProps {
  onClose: () => void
  onSearch: (query: string) => void
}

export const SearchBar = ({ onClose, onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch])

  const transitionProps = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%', transition: transitionProps }}
      transition={transitionProps}
      className="searchbarContainer bg-c900 absolute inset-0 top-0 left-0 z-50 flex h-full flex-col"
    >
      <div className="border-c800 flex items-center gap-3 border-b p-4">
        <button onClick={onClose} className="text-c200" aria-label="뒤로 가기">
          <ArrowLeft size={24} />
        </button>

        <div className="relative flex flex-1">
          <Search className="text-c200 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력해주세요."
            className="bg-c800 h-12 w-full rounded-full pr-4 pl-12 text-white outline-none"
            autoFocus
          />
        </div>
      </div>

      <SearchBarContent searchTerm={searchTerm} />
    </motion.div>
  )
}
