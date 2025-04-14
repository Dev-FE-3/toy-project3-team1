import { useState } from 'react'
import { GAMES } from '../constants/games'
import { Category } from '../model/types'

export const useCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(GAMES[0].name)

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  return {
    selectedCategory,
    handleCategorySelect,
  }
}
