import { useState, Suspense } from 'react'
import SearchBarResult from './SearchBarResult'
import useHashtag from '../hooks/useHashtag'
import HashtagFilterButton from './HashtagFilterButton'
import SkeletonAnimation from '@/shared/components/SkeletonAnimation'
import HomePageSkeleton from '../../HomePageSkeleton'

interface SearchBarContentProps {
  searchTerm: string
}

export default function SearchBarContent({ searchTerm }: SearchBarContentProps) {
  const { popularHashtags, isLoading } = useHashtag()
  const [selectedTag, setSelectedTag] = useState<string>('')

  const onFilterTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('')
    } else {
      setSelectedTag(tag)
    }
  }

  return (
    <>
      <div className="box-border flex min-h-[60px] items-center gap-2 overflow-hidden px-4 py-3">
        {/* 인기 해시태그 표시 */}
        {!isLoading &&
          popularHashtags.map((tag, idx) => (
            <HashtagFilterButton
              key={idx}
              name={tag}
              isSelected={selectedTag === tag}
              onFilterTag={() => onFilterTag(tag)}
            />
          ))}
      </div>

      {/* 검색 결과 영역 */}
      <Suspense fallback={<SkeletonAnimation children={<HomePageSkeleton />} />}>
        <SearchBarResult
          searchTerm={searchTerm}
          selectedTag={selectedTag !== '' ? selectedTag : null}
        />
      </Suspense>
    </>
  )
}
