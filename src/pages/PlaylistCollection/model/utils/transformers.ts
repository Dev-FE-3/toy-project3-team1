import { DBPlaylist, Playlist } from '@/pages/PlaylistCollection/model'

/**
 * DB에서 받아온 플레이리스트 데이터를 UI에서 사용할 수 있는 형태로 변환합니다.
 */
export const transformPlaylistForUi = (playlist: DBPlaylist): Playlist => ({
  id: playlist.id,
  title: playlist.title,
  thumbnailUrl: playlist.thumbnail_url,
  videoCount: playlist.playlist_items[0]?.count ?? 0,
  isPublic: playlist.is_public,
})
