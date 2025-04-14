import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useInfinitePlaylists } from './hooks/useInfinitePlaylists'
import { useEffect, useRef } from 'react'

const HomePage = () => {
  const gameCount = limitCategoryCount(GAMES.length)

  const { selectedCategory, handleCategorySelect } = useCategoryFilter()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePlaylists(selectedCategory)

  const playlists = data?.pages.flat() ?? []
  const loadMoreRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage])

  return (
    <>
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <PlaylistContainer key={selectedCategory} playlists={playlists} />
      <div ref={loadMoreRef} className="h-10" />
    </>
  )
}

export default HomePage
