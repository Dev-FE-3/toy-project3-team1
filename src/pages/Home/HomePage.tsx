import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import playlists from '@/pages/Home/Playlist'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/games'
import { limitCategoryCount } from './utils/limitCategoryCount'

const HomePage = () => {
  const defaultCategory = Object.keys(GAMES)[0]
  const gameCount = limitCategoryCount(Object.keys(GAMES).length)

  // 카테고리 필터링 훅 사용
  // playlists를 props로 전달하여 플레이리스트 필터링
  const { selectedCategory, filteredPlaylists, handleCategorySelect } = useCategoryFilter({
    playlists,
    defaultCategory,
  })

  // 현재 선택된 카테고리를 key로 사용하여 컴포넌트 리마운트
  const currentCategory = !selectedCategory ? defaultCategory : selectedCategory

  return (
    <>
      <Categories
        gameList={GAMES}
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
