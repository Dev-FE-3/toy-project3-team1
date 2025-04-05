import { ensureValidCount } from './types'
import { Categories } from './components/Categories/Categories'
import { userFavoriteGames } from './constants'

const HomePage = () => {
  const gameCount = ensureValidCount(Object.keys(userFavoriteGames).length)

  return (
    <>
      <Categories count={gameCount} />
    </>
  )
}

export default HomePage
