import { useCallback, useEffect, useState } from 'react'

import { useYouTubeVideo } from '@/shared/hooks/useYouTubeVideo'
import { createYouTubeUrl, extractVideoId, isValidVideoId } from '@/shared/model/utils/youtube'

export type Video = {
  id: string
  url: string
  title: string
  thumbnailUrl: string
}

type VideoManagementProps = {
  videos: Video[]
  onVideosChange: (videos: Video[]) => void
}

export const useVideoManagement = ({ videos, onVideosChange }: VideoManagementProps) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { video, isLoading, error } = useYouTubeVideo(videoId)

  // 중복 확인 함수를 useCallback으로 메모이제이션
  const isDuplicateVideo = useCallback(
    (id: string) => {
      return videos.some((item) => item.id === id)
    },
    [videos],
  )

  // 비디오 로드 및 처리 로직
  useEffect(() => {
    if (!video || !videoId) return

    try {
      if (!isDuplicateVideo(videoId)) {
        const newVideo = {
          id: videoId,
          url: createYouTubeUrl(videoId),
          title: video.title,
          thumbnailUrl: video.thumbnailUrl || '',
        }

        onVideosChange([...videos, newVideo])
        setErrorMessage(null)
      } else {
        setErrorMessage('이미 추가된 영상입니다.')
      }
    } catch (err) {
      console.error('비디오 추가 중 오류 발생:', err)
      setErrorMessage('비디오를 추가하는 중 오류가 발생했습니다.')
    } finally {
      // 비디오 추가 후 상태 초기화
      setVideoId(null)
      setVideoUrl('')
    }
  }, [video, videoId, onVideosChange, videos, isDuplicateVideo])

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      setErrorMessage('비디오 정보를 불러올 수 없습니다. 유효한 URL인지 확인해주세요.')
      setVideoId(null)
    }
  }, [error])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddVideo()
    }
  }

  const handleAddVideo = () => {
    setErrorMessage(null)

    const trimmedUrl = videoUrl.trim()
    if (!trimmedUrl) {
      setErrorMessage('URL을 입력해주세요.')
      return
    }

    const id = extractVideoId(trimmedUrl)

    if (!id) {
      setErrorMessage('유효한 YouTube URL이 아닙니다.')
      return
    }

    if (!isValidVideoId(id)) {
      setErrorMessage('유효하지 않은 비디오 ID입니다.')
      return
    }

    if (isDuplicateVideo(id)) {
      setErrorMessage('이미 추가된 영상입니다.')
      return
    }

    setVideoId(id)
  }

  const handleRemoveVideo = (index: number) => {
    onVideosChange(videos.filter((_, i) => i !== index))
  }

  return {
    videoUrl,
    isLoading,
    errorMessage,
    handleUrlChange,
    handleKeyPress,
    handleAddVideo,
    handleRemoveVideo,
  }
}
