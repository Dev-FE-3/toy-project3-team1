import { supabase } from '@/shared/model/api/supabase'
export const searchbarService = {
  // 인기 해시태그 조회
  async getPopularHashtags() {
    const { data, error } = await supabase.from('playlists').select('hashtag').eq('is_public', true)

    if (error) {
      console.error('Get popular hashtags error:', error)
      throw error
    }
    return data
  },

  // 검색 조건(검색어, 해시태그)에 따른 플레이리스트 조회
  async searchPlaylistsWithFilters(options: {
    searchTerm?: string
    hashtag?: string
    userId?: string
    offset?: number
    pageSize?: number
  }) {
    try {
      const { searchTerm, hashtag, userId, offset = 0, pageSize = 10 } = options

      // 검색 조건이 없으면 빈 배열 반환
      if (!searchTerm?.trim() && !hashtag) {
        return []
      }

      let query = supabase
        .from('playlists')
        .select(
          `
          *,
          profiles:profile_id (nickname)
        `,
        )
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      // 페이지네이션 적용
      if (offset !== undefined && pageSize !== undefined) {
        query = query.range(offset * pageSize, offset * pageSize + (pageSize - 1))
      }

      // 검색 필터 적용 (해시태그 필터와 검색어를 OR 조건으로 처리)
      const filterConditions = []

      // 해시태그 필터 조건
      if (hashtag) {
        filterConditions.push(`hashtag.cs.{${hashtag}}`)
      }

      // 검색어 필터 조건
      if (searchTerm && searchTerm.trim()) {
        filterConditions.push(`title.ilike.%${searchTerm}%`)
        filterConditions.push(`hashtag.cs.{${searchTerm}}`)
      }

      // 필터 조건이 있으면 OR 조건으로 적용
      if (filterConditions.length > 0) {
        query = query.or(filterConditions.join(','))
      }

      // 유저 필터링(본인 제외)
      if (userId) {
        query = query.neq('profile_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('통합 검색 오류:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('검색 결과 조회 오류:', error)
      throw error
    }
  },
}
