import { Layers, Search } from 'lucide-react'
import { Category } from './Category'
import { CategoriesProps } from '../../model/types'

export const Categories = ({
  gameList,
  count,
  onCategorySelect,
  selectedCategory,
}: CategoriesProps) => {
  return (
    <div className="bg-c900 flex h-22 w-full items-center justify-center gap-4">
      <Category>
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

      <Category isSelected={selectedCategory === '전체'} onClick={() => onCategorySelect('전체')}>
        <Layers size={34} strokeWidth={1.2} className="text-c200" />
      </Category>
    </div>
  )
}
