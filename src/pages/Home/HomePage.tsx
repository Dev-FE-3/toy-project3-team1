import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/games'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { Playlist } from './model/types'

const HomePage = () => {
  const gameCount = limitCategoryCount(GAMES.length)

  const { data: playlistData = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase.from('playlists').select('*').eq('is_public', true)
      if (error) {
        throw new Error('Error fetching playlists:')
      }
      return data as Playlist[]
    },
    refetchOnWindowFocus: false,
  })

  const { selectedCategory, filteredPlaylists, handleCategorySelect } = useCategoryFilter({
    playlists: playlistData,
  })

  return (
    <>
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <PlaylistContainer key={selectedCategory} playlists={filteredPlaylists} />
    </>
  )
}

export default HomePage
