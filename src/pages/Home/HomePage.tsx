import { Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '@/shared/model/lib/queryClient'
import HomePageSkeleton from './components/HomePageSkeleton'
import { DeferredComponent } from '@/shared/components/DeferredComponent'
import PlaylistSection from './components/PlaylistSection'

const gameCount = limitCategoryCount(GAMES.length)

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, handleCategorySelect } = useCategoryFilter()

  useEffect(() => {
    if (profile?.id) {
      queryClient.removeQueries({
        queryKey: ['playlists', profile.id, selectedCategory],
      })
    }
  }, [profile?.id, selectedCategory])

  return (
    <div className="flex h-full flex-col">
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      <Suspense
        key={selectedCategory}
        fallback={
          <DeferredComponent>
            {/* DeferredComponent : 2초 이상 지연이 걸릴 때 스켈레톤 UI 렌더 */}
            <AnimatePresence mode="wait">
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 top-27 z-10"
              >
                <HomePageSkeleton />
              </motion.div>
            </AnimatePresence>
          </DeferredComponent>
        }
      >
        <PlaylistSection userId={profile?.id} category={selectedCategory} />
      </Suspense>
    </div>
  )
}

export default HomePage
