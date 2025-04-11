import { useMemo, useState } from 'react'
import { Playlist } from '../model/types'
import { GAMES } from '../constants/games'

interface CategoryFilterProps {
  playlists: Playlist[]
}

export const useCategoryFilter = ({ playlists }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(GAMES[0].name)

  const filteredPlaylists = useMemo(() => {
    if (selectedCategory) {
      return playlists.filter((playlist) => playlist.hashtag.includes(selectedCategory))
    }
    return playlists
  }, [selectedCategory, playlists])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  }

  return {
    selectedCategory,
    filteredPlaylists,
    handleCategorySelect,
  }
}
