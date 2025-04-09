// Google API 키 - 실제 프로젝트에서는 환경 변수로 관리하는 것이 좋습니다
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''

// 비디오 상세 정보 인터페이스
export interface YouTubeVideoDetail {
  id: string
  title: string
  description: string
  channelId: string
  channelTitle: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
    standard?: { url: string; width: number; height: number }
    maxres?: { url: string; width: number; height: number }
  }
  tags?: string[]
  statistics: {
    viewCount: string
    likeCount: string
    subscriberCount: string
    commentCount: string
  }
}

/**
 * YouTube API를 사용하여 비디오 정보를 가져옵니다.
 * @param videoId YouTube 비디오 ID
 * @returns 비디오 상세 정보 또는 null (오류 발생 시)
 */
export const getYouTubeVideoDetails = async (
  videoId: string,
): Promise<YouTubeVideoDetail | null> => {
  if (!videoId) return null

  try {
    console.log('YouTube API 요청: 비디오 정보 가져오기', videoId)

    // API_KEY가 설정되지 않은 경우 더미 데이터 반환
    if (!API_KEY) {
      console.warn('YouTube API 키가 설정되지 않았습니다. 더미 데이터를 반환합니다.')
      return getDummyVideoDetails(videoId)
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${API_KEY}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('YouTube API 응답 오류:', errorData)
      return getDummyVideoDetails(videoId)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.warn('YouTube API: 비디오를 찾을 수 없습니다', videoId)
      return getDummyVideoDetails(videoId)
    }

    const videoData = data.items[0]
    const snippet = videoData.snippet
    const statistics = videoData.statistics

    return {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      thumbnails: snippet.thumbnails,
      tags: snippet.tags || [],
      statistics: {
        viewCount: statistics.viewCount || '0',
        likeCount: statistics.likeCount || '0',
        subscriberCount: statistics.subscriberCount || '0',
        commentCount: statistics.commentCount || '0',
      },
    }
  } catch (error) {
    console.error('YouTube API 호출 중 오류 발생:', error)
    return getDummyVideoDetails(videoId)
  }
}

/**
 * API 오류 또는 키 부재 시 사용할 더미 비디오 데이터
 */
const getDummyVideoDetails = (videoId: string): YouTubeVideoDetail => {
  return {
    id: videoId,
    title: '샘플 비디오 제목',
    description:
      '이 비디오 설명은 YouTube API 키가 제공되지 않았거나 API 호출 중 오류가 발생했을 때 표시됩니다.',
    channelId: 'UC_dummy_channel',
    channelTitle: '샘플 채널',
    publishedAt: new Date().toISOString(),
    thumbnails: {
      default: {
        url: `https://placehold.co/120x90/333/FFF?text=${videoId}`,
        width: 120,
        height: 90,
      },
      medium: {
        url: `https://placehold.co/320x180/333/FFF?text=${videoId}`,
        width: 320,
        height: 180,
      },
      high: {
        url: `https://placehold.co/480x360/333/FFF?text=${videoId}`,
        width: 480,
        height: 360,
      },
    },
    statistics: {
      viewCount: '1234',
      likeCount: '100',
      subscriberCount: '0',
      commentCount: '10',
    },
  }
}
