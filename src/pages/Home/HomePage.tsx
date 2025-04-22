import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import HomePageSkeleton from './components/HomePageSkeleton'
import { DeferredComponent } from '@/shared/components/DeferredComponent'
import PlaylistSection from './components/PlaylistSection'
import PlaylistNotFound from './components/PlaylistNotFound'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import SkeletonAnimation from '@/shared/components/SkeletonAnimation'

const gameCount = limitCategoryCount(GAMES.length)

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, handleCategorySelect } = useCategoryFilter()

  return (
    <div className="flex h-full flex-col">
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <ErrorBoundary fallback={<PlaylistNotFound />}>
        <Suspense
          key={selectedCategory}
          fallback={
            <DeferredComponent>
              {/* DeferredComponent : 0.3초 이상 지연이 걸릴 때 스켈레톤 UI 렌더 */}
              <SkeletonAnimation children={<HomePageSkeleton />} />
            </DeferredComponent>
          }
        >
          <PlaylistSection userId={profile?.id} category={selectedCategory} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default HomePage
