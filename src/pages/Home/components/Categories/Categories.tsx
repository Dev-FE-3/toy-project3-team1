import { Layers, Search } from 'lucide-react'
import { Category } from './Category'
import { CategoriesProps } from '../../model/types'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchBar } from '../SearchBar/SearchBar'

export const Categories = ({
  gameList,
  count,
  onCategorySelect,
  selectedCategory,
  onSearch,
  searchActive,
  onSearchQuery,
  handleCloseSearch,
}: CategoriesProps) => {
  return (
    <div className="bg-c900 flex h-22 w-full items-center justify-center gap-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, scale: 0.97 }}
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
          <Category onClick={onSearch}>
            <Search size={34} strokeWidth={1.5} className="text-c200" />
          </Category>

          {gameList.slice(0, count).map((game) => (
            <Category
              key={game.name}
              isSelected={selectedCategory === game.name}
              onClick={() => onCategorySelect(game.name)}
            >
              <img src={game.logoUrl} alt={game.name} className="h-10 w-10 object-contain" />
            </Category>
          ))}

          <Category
            isSelected={selectedCategory === '전체'}
            onClick={() => onCategorySelect('전체')}
          >
            <Layers size={34} strokeWidth={1.2} className="text-c200" />
          </Category>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
