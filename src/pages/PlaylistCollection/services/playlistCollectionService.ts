import { supabase } from '@/shared/model/api/supabase'

import { Playlist } from '@/pages/PlaylistCollection/model'

// DB에서 반환되는 플레이리스트 데이터 타입
interface DBPlaylist {
  id: string
  title: string
  thumbnail_url: string
  hashtag?: string[]
  playlist_items: { count: number }[]
  is_public: boolean
}

// 공통으로 사용되는 플레이리스트 선택 필드
const PLAYLIST_SELECT = `
  id,
  title,
  thumbnail_url,
  playlist_items (count),
  is_public
`

// 플레이리스트 데이터 변환 유틸리티 함수
const transformPlaylistData = (playlist: DBPlaylist): Playlist => ({
  id: playlist.id,
  title: playlist.title,
  thumbnailUrl: playlist.thumbnail_url,
  videoCount: playlist.playlist_items?.[0]?.count || 0,
  isPublic: playlist.is_public,
})

interface PaginationParams {
  page: number
  pageSize: number
  type: 'myPlaylists' | 'subscribedPlaylists'
}

export const playlistCollectionService = {
  // 플레이리스트 삭제
  async deletePlaylist(playlistId: string) {
    const tables = ['playlist_items', 'playlist_subscribers', 'playlists']

    try {
      for (const table of tables) {
        const { error } = await supabase.from(table).delete().eq('id', playlistId)
        if (error) throw new Error(`${table} 삭제 중 오류가 발생했습니다.`)
      }
      return true
    } catch (error) {
      throw error instanceof Error ? error : new Error('플레이리스트 삭제 중 오류가 발생했습니다.')
    }
  },

  // 내 플레이리스트 조회
  async getMyPlaylists(profileId: string, { page, pageSize }: { page: number; pageSize: number }) {
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error } = await supabase
        .from('playlists')
        .select(PLAYLIST_SELECT)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw new Error('내 플레이리스트를 불러오는데 실패했습니다.')
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('내 플레이리스트를 불러오는데 실패했습니다.')
    }
  },

  // 구독한 플레이리스트 조회
  async getSubscribedPlaylists(
    profileId: string,
    { page, pageSize }: { page: number; pageSize: number },
  ) {
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data: subscriptions, error: subscriptionError } = await supabase
        .from('playlists_subscribers')
        .select('playlist_id')
        .eq('user_id', profileId)
        .range(from, to)

      if (subscriptionError || !subscriptions?.length) return []

      const { data: playlists, error: playlistError } = await supabase
        .from('playlists')
        .select(PLAYLIST_SELECT)
        .in(
          'id',
          subscriptions.map((sub: { playlist_id: string }) => sub.playlist_id),
        )

      if (playlistError) throw new Error('구독 플레이리스트를 불러오는데 실패했습니다.')
      return playlists || []
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('구독 플레이리스트를 불러오는데 실패했습니다.')
    }
  },

  // 전체 플레이리스트 컬렉션 조회
  async getPlaylistCollection(profileId: string, params: PaginationParams) {
    try {
      const { page, pageSize, type } = params
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      if (type === 'myPlaylists') {
        const { data: myPlaylists } = await supabase
          .from('playlists')
          .select(PLAYLIST_SELECT)
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false })
          .range(from, to)

        return {
          myPlaylists: myPlaylists?.map(transformPlaylistData) || [],
          subscribedPlaylists: [],
        }
      }

      const subscribedPlaylists = await this.getSubscribedPlaylists(profileId, { page, pageSize })
      return {
        myPlaylists: [],
        subscribedPlaylists: subscribedPlaylists.slice(from, to + 1),
      }
    } catch {
      return { myPlaylists: [], subscribedPlaylists: [] }
    }
  },

  // 모든 해시태그 목록 가져오기
  async getAllHashtags() {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('hashtag')
        .not('hashtag', 'is', null)

      if (error) throw new Error('해시태그 목록을 가져오는데 실패했습니다.')
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('해시태그 목록을 가져오는데 실패했습니다.')
    }
  },

  // 해시태그별로 플레이리스트 그룹화하기
  async getPlaylistsByHashtag(tag: string) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(PLAYLIST_SELECT)
        .contains('hashtag', [tag])

      if (error) throw new Error(`${tag} 해시태그의 플레이리스트를 가져오는데 실패했습니다.`)
      return data || []
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(`${tag} 해시태그의 플레이리스트를 가져오는데 실패했습니다.`)
    }
  },

  // 플레이리스트 구독 취소
  async unsubscribePlaylist(playlistId: string) {
    try {
      const { error } = await supabase
        .from('playlists_subscribers')
        .delete()
        .eq('playlist_id', playlistId)

      if (error) throw new Error('플레이리스트 구독 취소 중 오류가 발생했습니다.')
      return true
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('플레이리스트 구독 취소 중 오류가 발생했습니다.')
    }
  },
}
