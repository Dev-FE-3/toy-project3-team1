import { useState } from 'react'
import { GAMES } from '../constants/GAMES'
import { Category } from '../model/types'

export const useCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(GAMES[0].name)

  const onCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  return {
    selectedCategory,
    onCategorySelect,
  }
}
