import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useInfinitePlaylists } from './hooks/useInfinitePlaylists'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '@/shared/model/lib/queryClient'
import { useInView } from 'react-intersection-observer'
import HomePageSkeleton from './components/HomePageSkeleton'
import EmptyPlaylistCard from './components/PlaylistCard/EmptyPlaylistCard'
import { SearchBar } from './components/SearchBar/SearchBar'

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, handleCategorySelect } = useCategoryFilter()
  const [searchActive, setSearchActive] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePlaylists(
    profile?.id,
    selectedCategory,
  )

  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 })
  const gameCount = limitCategoryCount(GAMES.length)
  const playlists = data?.pages.flat() ?? []

  const [showSkeleton, setShowSkeleton] = useState(true)

  const onSearchQuery = (query: string) => {
    console.log(query)
  }

  const onSearch = () => {
    setSearchActive(true)
  }

  const handleCloseSearch = () => {
    setSearchActive(false)
  }

  // 스켈레톤 상태 변경
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowSkeleton(false), 1000) // 딜레이를 주어 스켈레톤이 사라짐
      return () => clearTimeout(timer)
    } else {
      setShowSkeleton(true)
    }
  }, [isLoading])

  // 무한 스크롤 로딩
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 프로필 변경 시 쿼리 초기화
  useEffect(() => {
    if (profile?.id) {
      queryClient.removeQueries({
        queryKey: ['playlists', profile.id, selectedCategory],
      })
    }
  }, [profile?.id, selectedCategory])

  return (
    <div className="home-content relative flex h-full flex-col">
      <AnimatePresence mode="wait" initial={false}>
        {searchActive && (
          <motion.div
            className="flex w-full items-center justify-center gap-3 px-4"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              mass: 0.8,
              restDelta: 0.001,
            }}
          >
            <SearchBar onClose={handleCloseSearch} onSearch={onSearchQuery} gameList={GAMES} />
          </motion.div>
        )}
      </AnimatePresence>

      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        onSearch={onSearch}
        searchActive={searchActive}
        onSearchQuery={onSearchQuery}
        handleCloseSearch={handleCloseSearch}
      />

      {/* isLoading이 true일 때 스켈레톤을 보여주고, false일 때 실제 콘텐츠를 보여줌 */}
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 top-27 z-10"
          >
            <HomePageSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex-1"
          >
            {playlists.length > 0 ? (
              <>
                <PlaylistContainer playlists={playlists} />
              </>
            ) : (
              <EmptyPlaylistCard />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  )
}

export default HomePage
