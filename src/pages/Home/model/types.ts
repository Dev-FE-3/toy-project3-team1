import { ReactNode } from 'react'

// Utility Types & Functions
export const ensureValidCount = (count: number): number => {
  return Math.min(count, 4)
}

export type SwipeDirection = 'up' | 'down'

// User Related Types
interface User {
  name: string
  imageUrl?: string
}

// Category Related Types
export interface CategoryProps {
  children?: ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export interface CategoriesProps {
  count: number
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}

// Playlist Related Types
export interface Playlist {
  id: number
  title: string
  tag: string[]
  imageUrl: string | string[]
  user: User
  likes: number
  bookmarks: number
  isLiked?: boolean
  isBookmarked?: boolean
  uploadedDate: string
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
