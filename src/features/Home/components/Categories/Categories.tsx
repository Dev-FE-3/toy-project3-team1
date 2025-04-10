import { Category } from './Category'
import { Search } from 'lucide-react'
import { CategoriesProps } from '../../types'
import { games } from '../../constants'

export const Categories = ({ count, onCategorySelect, selectedCategory }: CategoriesProps) => {
  const handleCategoryClick = (gameName: string) => {
    onCategorySelect(gameName)
  }

  return (
    <div className="bg-c900 flex h-[98px] w-[480px] items-center justify-center gap-4">
      <Category>
        <Search size={34} strokeWidth={2} className="text-c200" />
      </Category>

      {Object.entries(games)
        .slice(0, count)
        .map(([gameName, imagePath], index) => (
          <Category
            key={index}
            isSelected={selectedCategory === gameName}
            onClick={() => handleCategoryClick(gameName)}
          >
            <img src={imagePath} alt={gameName} className="h-[40px] w-[40px] object-contain" />
          </Category>
        ))}
    </div>
  )
}
