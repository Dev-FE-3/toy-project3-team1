import { Suspense, useCallback } from 'react'
import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import HomePageSkeleton from './components/HomePageSkeleton'
import PlaylistSection from './components/PlaylistSection'
import PlaylistNotFound from './components/PlaylistNotFound'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import SkeletonAnimation from '@/shared/components/SkeletonAnimation'
import { SearchBar } from './components/SearchBar/SearchBar'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const gameCount = limitCategoryCount(GAMES.length)

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, onCategorySelect } = useCategoryFilter()

  // URL 쿼리 파라미터 관리를 위한 훅 사용
  const [searchParams, setSearchParams] = useSearchParams()
  const searchActive = searchParams.get('search') === 'true'

  // 검색 활성화 함수
  const onSearch = useCallback(() => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('search', 'true')
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

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
            <SearchBar />
          </motion.div>
        )}
      </AnimatePresence>

      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
        onSearch={onSearch}
      />
      <ErrorBoundary fallback={<PlaylistNotFound />}>
        <Suspense
          key={selectedCategory}
          fallback={<SkeletonAnimation children={<HomePageSkeleton />} />}
        >
          <PlaylistSection userId={profile?.id} category={selectedCategory} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default HomePage
