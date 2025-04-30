import { Playlist, VideoItem } from '@/pages/Home/model/types'

export type PlaylistWithItems = Playlist & { playlist_items: VideoItem[] }

export interface Profile {
  id: string
  nickname: string
  created_at: string
  email: string
  profile_image_url?: string | null
}
