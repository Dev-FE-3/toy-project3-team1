import { Playlist, VideoItem } from '@/pages/Home/model/types'

export type PlaylistWithItems = Playlist & { playlist_items: VideoItem[] }
