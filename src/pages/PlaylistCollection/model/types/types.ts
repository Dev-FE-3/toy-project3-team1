export interface Playlist {
  id: string
  title: string
  thumbnailUrl: string
  videoCount: number
  isPublic: boolean
}

export interface TabItem {
  key: string
  label: string
}

export interface PlaylistCollection {
  myPlaylists: Playlist[]
  subscribedPlaylists: Playlist[]
}

export type TabKey = 'myPlaylists' | 'subscribedPlaylists'

export interface DBPlaylist {
  id: string
  title: string
  thumbnail_url: string
  playlist_items: { count: number }[]
  is_public: boolean
}
