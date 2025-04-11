import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import playlists from '@/pages/Home/Playlist'
import { ensureValidCount } from '@/pages/Home/model/types'
import { games } from '@/pages/Home/constants/constants'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'

const HomePage = () => {
  const defaultCategory = Object.keys(games)[0]
  const gameCount = ensureValidCount(Object.keys(games).length)

  const { selectedCategory, filteredPlaylists, handleCategorySelect } = useCategoryFilter({
    playlists,
    defaultCategory,
  })

  // 현재 선택된 카테고리를 key로 사용하여 컴포넌트 리마운트
  const currentCategory = !selectedCategory ? defaultCategory : selectedCategory

  return (
    <>
      <Categories
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={currentCategory}
      />
      <PlaylistContainer
        key={currentCategory} // 카테고리가 변경될 때마다 컴포넌트 리마운트
        playlists={filteredPlaylists}
      />
    </>
  )
}

export default HomePage
