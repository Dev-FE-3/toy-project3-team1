import { Category } from './Category'
import { Search } from 'lucide-react'
import { CategoriesProps } from '../../types'
import { games } from '../../constants'

export const Categories = ({ count, onCategorySelect, selectedCategory }: CategoriesProps) => {
  const handleCategoryClick = (gameName: string) => {
    // 이제 null을 전달해도 타입 에러가 발생하지 않습니다
    onCategorySelect(gameName === selectedCategory ? null : gameName)
  }

  return (
    <div className="bg-c900 flex h-[98px] w-[480px] items-center justify-center gap-4">
      {/* null을 전달해도 타입 에러가 발생하지 않습니다 */}
      <Category>
        <Search size={34} strokeWidth={1.2} className="text-c200" />
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
