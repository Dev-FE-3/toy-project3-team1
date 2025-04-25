import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'

type Hashtag = string

// 인기 해시태그 조회
export default function useHashtag() {
  const { data: popularHashtags = [], isLoading } = useQuery<Hashtag[]>({
    queryKey: ['popularHashtags'],
    queryFn: async () => {
      try {
        // 공개된 모든 플레이리스트의 해시태그만 가져오기
        const { data, error } = await supabase
          .from('playlists')
          .select('hashtag')
          .not('hashtag', 'is', null)
          .eq('is_public', true)

        if (error) throw new Error('해시태그 목록을 가져오는데 실패했습니다.')

        if (!data || data.length === 0) return []

        // 해시태그 빈도수 계산 및 상위 5개 추출
        const hashtagFrequency: Record<string, number> = {}

        data.forEach((playlist) => {
          if (playlist.hashtag && Array.isArray(playlist.hashtag)) {
            playlist.hashtag.forEach((tag) => {
              if (tag) {
                hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1
              }
            })
          }
        })

        // 빈도수 기준 내림차순 정렬 후 상위 5개 반환
        return Object.entries(hashtagFrequency)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag)
      } catch (error) {
        console.error('해시태그 처리 중 오류:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5분 캐시
  })

  return {
    popularHashtags,
    isLoading,
  }
}
