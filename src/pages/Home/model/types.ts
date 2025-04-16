import { ReactNode } from 'react'
import { Game } from '../constants/GAMES'

export type SwipeDirection = 'up' | 'down'

// Update Category type
export type Category = string | '전체' | null

export interface CategoryProps {
  children: ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export interface CategoriesProps {
  gameList: Game[]
  count: number
  onCategorySelect: (category: Category) => void
  selectedCategory: Category
}

export interface VideoItem {
  id: string
  title: string
  thumbnail_url: string
}

// Playlist Related Types
export interface Playlist {
  id: string
  title: string
  hashtag: string[]
  thumbnail_url: string
  profile_id: string
  profiles: {
    nickname: string
    imageUrl: string
  }
  like_count: number
  subscriber_count: number
  isLiked?: boolean
  isBookmarked?: boolean
  created_at: string
  description?: string
}

export interface PlaylistWithItems extends Playlist {
  playlist_items: VideoItem[]
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
  carouselRef: React.RefObject<HTMLDivElement | null> // null 허용
  isBackground: boolean
}

export interface CarouselViewProps {
  images: string[]
  title: string
  carouselRef: React.RefObject<HTMLDivElement | null> // null 허용
  isBackground: boolean
}

export interface PlaylistContainerProps {
  playlists: Playlist[]
}
