import { ensureValidCount } from '@/features/Home/types'
import { userFavoriteGames } from '@/features/Home/constants'
import { Categories } from '@/features/Home/components/Categories/Categories'

const HomePage = () => {
  const gameCount = ensureValidCount(Object.keys(userFavoriteGames).length)

  return (
    <>
      <Categories count={gameCount} />
    </>
  )
}

export default HomePage
