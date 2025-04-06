import { supabase } from '../lib/supabase'

export interface Video {
  id: string
  title: string
  thumbnail: string
  views: string
  date: string
  duration: string
}

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail_url: string
  is_public: boolean
  created_at: string
  profile_id: string
}

// 플레이리스트 상세 정보 가져오기
export const getPlaylistById = async (playlistId: string): Promise<Playlist | null> => {
  console.log('getPlaylistById 호출, 요청한 플레이리스트 ID:', playlistId)

  try {
    console.log('시작')
    const { data: authData } = await supabase.auth.getSession()
    const isLoggedIn = !!authData.session
    console.log(' getPlaylistVideos ~ isLoggedIn: ', isLoggedIn)

    const { data: checkData, error: checkError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)

    console.log('테이블 확인 결과:', checkData)

    if (checkError) {
      console.error('테이블 확인 중 오류:', checkError)
    }

    // 이제 단일 레코드 쿼리 시도
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single()

    if (error) {
      console.error('플레이리스트 정보를 가져오는 중 오류 발생:', error)

      // 샘플 데이터로 폴백
      return {
        id: playlistId,
        title: '오버워치 오리사 플레이 모음',
        description: '오버워치2 오리사 하이라이트 모음입니다. 재미있게 봐주세요!',
        thumbnail_url: 'https://placehold.co/1280x720/3a4a5a/FFF?text=Orisa+Playlist',
        is_public: true,
        created_at: new Date().toISOString(),
        profile_id: '3faf9977-36f1-4f3f-a393-fb7e06b5a3ae',
      }
    }

    return data
  } catch (error) {
    console.error('예상치 못한 오류 발생:', error)

    // 샘플 데이터로 폴백
    return {
      id: playlistId,
      title: '오버워치 오리사 플레이 모음',
      description: '오버워치2 오리사 하이라이트 모음입니다. 재미있게 봐주세요!',
      thumbnail_url: 'https://placehold.co/1280x720/3a4a5a/FFF?text=Orisa+Playlist',
      is_public: true,
      created_at: new Date().toISOString(),
      profile_id: '3faf9977-36f1-4f3f-a393-fb7e06b5a3ae',
    }
  }
}

// 플레이리스트에 속한 비디오 항목들 가져오기
export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  console.log('요청한 플레이리스트 ID:', playlistId)

  try {
    // 수동으로 인증 상태 확인
    const { data: authData } = await supabase.auth.getSession()
    const isLoggedIn = !!authData.session
    console.log(' getPlaylistVideos ~ isLoggedIn: ', isLoggedIn)

    // 요청 시 타임아웃 설정
    let requestPromise

    if (isLoggedIn) {
      console.log('로그인 상태에서 요청, 익명 클라이언트 사용')
      // 익명 클라이언트 사용 (토큰 없이)
      const { createClient } = await import('@supabase/supabase-js')
      const anonClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false } },
      )

      requestPromise = anonClient.from('playlist_items').select('*').eq('playlist_id', playlistId)
    } else {
      console.log('로그아웃 상태에서 요청, 기본 클라이언트 사용')
      requestPromise = supabase.from('playlist_items').select('*').eq('playlist_id', playlistId)
    }

    const { data, error } = await requestPromise

    if (error) {
      console.error('데이터 조회 오류:', error)
      return getDummyVideos()
    }

    if (!data || data.length === 0) {
      console.log('데이터 없음')
      return getDummyVideos()
    }

    return convertToVideos(data)
  } catch (error) {
    console.error('예외 발생:', error)
    return getDummyVideos()
  }
}

// Supabase에서 반환되는 플레이리스트 아이템 타입 정의
interface PlaylistItem {
  id?: string
  video_id?: string
  title?: string
  thumbnail_url?: string
  created_at?: string
  duration?: string
  statistics?: {
    viewCount?: string
    [key: string]: string | undefined
  }
  playlist_id?: string
  position?: number
  added_at?: string
  updated_at?: string
  description?: string
  // [key: string]: any // 알 수 없는 추가 필드 허용
}

// 데이터를 비디오 포맷으로 변환하는 함수
const convertToVideos = (data: PlaylistItem[]): Video[] => {
  console.log('데이터 변환 중...')
  return data.map((item) => {
    try {
      return {
        id: item.id || item.video_id || '임시ID',
        title: item.title || '제목 없음',
        thumbnail:
          item.thumbnail_url || 'https://placehold.co/300x169/2a3a4a/FFF?text=No+Thumbnail',
        views: (item.statistics && item.statistics.viewCount) || '조회수 정보가 없습니다',
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString('ko-KR')
          : '날짜 정보 없음',
        duration: item.duration || '00:00',
      }
    } catch (itemError) {
      console.error('아이템 변환 중 오류:', itemError, item)
      return {
        id: '오류',
        title: '데이터 변환 중 오류 발생',
        thumbnail: 'https://placehold.co/300x169/ff0000/FFF?text=Error',
        views: '오류',
        date: '오류',
        duration: '00:00',
      }
    }
  })
}

// 더미 비디오 데이터 반환 (오류 발생 시 사용)
const getDummyVideos = (): Video[] => {
  console.log('더미 비디오 데이터 반환')
  return [
    {
      id: '1',
      title: 'ORISA BARRIER STRATEGY',
      thumbnail: 'https://placehold.co/300x169/2a3a4a/FFF?text=Orisa',
      views: '240회',
      date: '2024.12.1',
      duration: '1:42',
    },
    {
      id: '2',
      title: '오버워치2 오리사 장인의 신규 메타 전략!',
      thumbnail: 'https://placehold.co/300x169/3a4a5a/FFF?text=Orisa2',
      views: '1.2만회',
      date: '2024.11.15',
      duration: '8:42',
    },
    {
      id: '3',
      title: '탱커 오리사 3분만에 배우기!',
      thumbnail: 'https://placehold.co/300x169/4a5a6a/FFF?text=Orisa3',
      views: '3.5만회',
      date: '2024.10.28',
      duration: '3:11',
    },
  ]
}

// // 무한 스크롤을 위한 페이지네이션된 비디오 가져오기
// export const getPlaylistVideosPaginated = async (
//   playlistId = '8575f134-4936-4b6a-a833-395936663775',
//   pageParam = 0,
//   pageSize = 2,
// ): Promise<{
//   videos: Video[]
//   nextCursor: number | null
// }> => {
//   // 현재 페이지의 시작 위치
//   const startIndex = pageParam * pageSize

//   // Supabase 쿼리
//   const { data, error } = await supabase.from('playlist_items').select('*').eq('id', playlistId)
//   // .order('position', { ascending: true })
//   // .range(startIndex, startIndex + pageSize - 1) // PostgreSQL의 range는 inclusive

//   if (error) {
//     console.error('페이지네이션된 비디오를 가져오는 중 오류 발생:', error)
//     throw error
//   }

//   // 전체 아이템 수를 확인하여 다음 페이지 여부 결정
//   const { count, error: countError } = await supabase
//     .from('playlist_items')
//     .select('*', { count: 'exact', head: true })
//     .eq('playlist_id', playlistId)

//   if (countError) {
//     console.error('전체 비디오 수를 가져오는 중 오류 발생:', countError)
//     throw countError
//   }

//   // 다음 페이지 여부 계산
//   const totalCount = count || 0
//   const nextCursor = startIndex + pageSize < totalCount ? pageParam + 1 : null

//   // 가져온 데이터를 비디오 형식으로 변환
//   const videos = data.map((item) => ({
//     id: item.video_id,
//     title: item.title,
//     thumbnail: item.thumbnail_url,
//     views: '조회수 정보가 없습니다',
//     date: new Date(item.added_at).toLocaleDateString('ko-KR'),
//     duration: '00:00',
//   }))

//   return {
//     videos,
//     nextCursor,
//   }
// }
