import { useState } from 'react'
import { CategoriesProps } from '../../types'
import { Category } from '../Category/Category'
import { Plus, Search } from 'lucide-react'
import { userFavoriteGames } from '../../constants'

export const Categories = ({ count }: CategoriesProps) => {
  // 초기값을 0으로 설정하여 첫 번째 이미지 카테고리가 선택되도록 함
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const gameImages = Object.values(userFavoriteGames)

  const handleCategoryClick = (index: number) => {
    // 게임 이미지 카테고리만 선택 가능
    if (index >= 0 && index < gameImages.length) {
      setSelectedIndex(selectedIndex === index ? index : index)
    }
  }

  return (
    <div className="bg-900 absolute top-0 flex h-[98px] w-[480px] items-center justify-center gap-4">
      {/* 검색 */}
      <Category onClick={() => handleCategoryClick(-1)}>
        <Search size={34} strokeWidth={1.2} className="text-200" />
      </Category>

      {/* 게임 카테고리 나열 */}
      {gameImages.slice(0, count).map((imagePath, index) => (
        <Category
          key={index}
          isSelected={selectedIndex === index}
          onClick={() => handleCategoryClick(index)}
        >
          <img
            src={imagePath}
            alt={`Game ${index + 1}`}
            className="h-[40px] w-[40px] object-contain"
          />
        </Category>
      ))}

      {/* 카테고리 추가 */}
      {count < 3 && (
        <Category onClick={() => handleCategoryClick(gameImages.length)}>
          <Plus size={34} strokeWidth={1.2} className="text-200" />
        </Category>
      )}
    </div>
  )
}
