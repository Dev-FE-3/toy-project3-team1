import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import playlists from '@/pages/Home/Playlist'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/games'
import { limitCategoryCount } from './utils/limitCategoryCount'

const HomePage = () => {
  const gameCount = limitCategoryCount(GAMES.length)

  const { selectedCategory, filteredPlaylists, handleCategorySelect } = useCategoryFilter({
    playlists,
  })

  return (
    <>
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory} // currentCategory 대신 selectedCategory 직접 사용
      />
      <PlaylistContainer 
        key={selectedCategory} 
        playlists={filteredPlaylists} 
      />
    </>
  )
}

export default HomePage
