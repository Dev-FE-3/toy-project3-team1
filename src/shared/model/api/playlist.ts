import { supabase } from '@/shared/model/api/supabase'

export interface Video {
  id: string
  title: string
  thumbnail: string
  views: string
  date: string
  duration: string
  video_id: string
}

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail_url: string
  is_public: boolean
  created_at: string
  profile_id: string
  likeCount: number
  subscriberCount: number
}

// 플레이리스트 상세 정보 가져오기
export const getPlaylistById = async (playlistId: string, profileId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/playlist-detail`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ playlistId, profileId }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '플레이리스트를 불러오는데 실패했습니다.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('플레이리스트 조회 중 에러:', error)
    throw error
  }
}

export const getPlaylistByIdWithSupabase = async (playlistId: string) => {
  const { data, error } = await supabase
    .from('playlists')
    .select(
      `
      *,
      playlist_items(*),
      profiles:profiles(*),
      subscriber_count,
      comment_count
    `,
    )
    .eq('id', playlistId)
    .single()

  if (error) throw new Error('플레이리스트를 불러오는데 실패했습니다.')
  return data
}
