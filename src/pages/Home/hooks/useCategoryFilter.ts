import { useMemo, useState } from 'react'
import { Playlist } from '../model/types'

interface CategoryFilterProps {
  playlists: Playlist[]
  defaultCategory: string
}

export const useCategoryFilter = ({ playlists, defaultCategory }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPlaylists = useMemo(() => {
    const categoryToUse = selectedCategory || defaultCategory
    return playlists.filter((playlist) => playlist.tag.includes(categoryToUse))
  }, [selectedCategory, defaultCategory, playlists])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  }

  return {
    selectedCategory,
    filteredPlaylists,
    handleCategorySelect,
  }
}
