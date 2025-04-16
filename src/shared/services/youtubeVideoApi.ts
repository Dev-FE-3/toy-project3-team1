import { YouTubeVideoRaw } from '../model/types/youtube.type'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

// 하나의 비디오 데이터 가져오기
export const fetchRawYouTubeVideoData = async (videoId: string): Promise<YouTubeVideoRaw> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
  }

  const data = await response.json()
  if (!data.items || data.items.length === 0) {
    throw new Error('비디오를 찾을 수 없습니다.')
  }

  return data.items[0]
}

// 여러 개의 비디오 데이터 가져오기
export const fetchMultipleYouTubeVideos = async (
  videoIds: string[],
): Promise<YouTubeVideoRaw[]> => {
  if (!videoIds.length) {
    return []
  }

  // 최대 50개까지만 처리 (YouTube API 제한)
  const ids = videoIds.slice(0, 50).join(',')

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${YOUTUBE_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
  }

  const data = await response.json()
  if (!data.items || data.items.length === 0) {
    throw new Error('비디오를 찾을 수 없습니다.')
  }

  return data.items
}
