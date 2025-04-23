import { ReactNode } from 'react'
import { Game } from '../constants/GAMES'

/** --- 카테고리 관련 타입 --- */
export type SwipeDirection = 'Up' | 'Down' | 'Neutral'
export type Category = string | '전체' | undefined

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

/** --- 비디오 아이템 타입 --- */
export interface VideoItem {
  id: string
  playlist_id: string
  video_id: string
  title: string
  created_at: string
  statistics: string[]
  sort_order: number
  thumbnail_url: string
}

/** --- 플레이리스트 타입 --- */
export interface Playlist {
  id: string
  title: string
  hashtag?: string[]
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
