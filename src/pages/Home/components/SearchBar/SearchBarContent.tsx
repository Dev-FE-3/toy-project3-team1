import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils'
import { GAMES } from '@/pages/Home/constants/GAMES'
import SearchBarResult from './SearchBarResult'

// 필터 버튼 컴포넌트
interface FilterButtonProps {
  name: string
  isSelected: boolean
  onClick: () => void
  children: React.ReactNode
  logoOnly?: boolean
}

const FilterButton = ({
  name,
  isSelected,
  onClick,
  children,
  logoOnly = false,
}: FilterButtonProps) => {
  return (
    <button
      className={cn(
        'bg-c900 relative flex h-24 w-full flex-col items-center justify-center rounded-lg border border-gray-700',
        isSelected ? 'border-white/30' : 'border-transparent',
      )}
      onClick={onClick}
      aria-label={`${name} 필터링`}
    >
      <div className="flex items-center justify-center">{children}</div>
      {!logoOnly && (
        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-lg font-semibold">#{name}</span>
        </div>
      )}
    </button>
  )
}

interface SearchBarContentProps {
  searchTerm: string
}

export default function SearchBarContent({ searchTerm }: SearchBarContentProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('전체')

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter)
    // 필터에 따른 검색 결과 필터링 로직 추가
  }

  return (
    <>
      {/* 검색 필터 영역 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <FilterButton
          name="전체"
          isSelected={selectedFilter === '전체'}
          onClick={() => handleFilterSelect('전체')}
          logoOnly={true}
        >
          <div className="h-12 w-[80%] overflow-hidden">
            <div className="h-full w-full rounded-t-full bg-yellow-300/80"></div>
          </div>
        </FilterButton>

        {GAMES.map((game) => (
          <FilterButton
            key={game.id}
            name={game.name}
            isSelected={selectedFilter === game.name}
            onClick={() => handleFilterSelect(game.name)}
          >
            <img src={game.logoUrl} alt={game.name} className="h-14 w-14 object-contain" />
          </FilterButton>
        ))}
      </div>

      {/* 검색 결과 영역 */}
      <SearchBarResult
        searchTerm={searchTerm}
        category={selectedFilter !== '전체' ? selectedFilter : null}
      />
    </>
  )
}
