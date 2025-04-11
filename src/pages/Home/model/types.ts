import { ReactNode } from 'react'
import { Game } from '../constants/games'

export type SwipeDirection = 'up' | 'down'

// Category Related Types
export interface CategoryProps {
  children?: ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export interface CategoriesProps {
  gameList: Game[]
  count: number
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}

// Playlist Related Types
export interface Playlist {
  id: number
  title: string
  hashtag: string[]
  thumbnail_url: string | string[]
  profile_id: string
  likeCount: number
  subscriberCount: number
  isLiked?: boolean
  isBookmarked?: boolean
  created_at: string
}

// Component Props Types
export interface PlaylistViewProps {
  playlists: Playlist[]
  focusedIndex: number
  currentImageIndex: number
  carouselRef: React.RefObject<HTMLDivElement | null>
  swipeDirection: SwipeDirection
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
}

export interface PlaylistCardProps {
  playlist: Playlist
  carouselRef: React.RefObject<HTMLDivElement | null>
  isBackground?: boolean
}

export interface CarouselViewProps {
  images: string[]
  title: string
  carouselRef: React.RefObject<HTMLDivElement | null>
  isBackground?: boolean
}

export interface PlaylistContainerProps {
  playlists: Playlist[]
}
