import { useState } from 'react'
import { PlaylistFormValues } from '@/pages//PlaylistForm/model/types'

interface UseSubmitPlaylistProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface FormattedPlaylistData {
  title: string
  description: string
  hashtags: string
  isPublic: string
  videoCount: number
  videoList: string
  thumbnail: string
}

export const useSubmitPlaylist = ({ onSuccess, onError }: UseSubmitPlaylistProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)
  const [formattedData, setFormattedData] = useState<FormattedPlaylistData | null>(null)

  const formatPlaylistData = (data: PlaylistFormValues): FormattedPlaylistData => {
    return {
      title: data.title,
      description: data.description || '(내용 없음)',
      hashtags: data.hashtags.length > 0 ? data.hashtags.join(', ') : '(해시태그 없음)',
      isPublic: data.isPublic ? '공개' : '비공개',
      videoCount: data.videos.length,
      videoList: data.videos.map((v) => `${v.title} (ID: ${v.id})`).join('\n- '),
      thumbnail: data.thumbnail ? '등록됨' : '등록되지 않음',
    }
  }

  const showFormattedDataAlert = (formattedData: FormattedPlaylistData) => {
    alert(
      `📋 플레이리스트 정보 📋\n\n` +
        `제목: ${formattedData.title}\n` +
        `설명: ${formattedData.description}\n` +
        `해시태그: ${formattedData.hashtags}\n` +
        `공개 여부: ${formattedData.isPublic}\n` +
        `썸네일: ${formattedData.thumbnail}\n` +
        `등록된 영상: ${formattedData.videoCount}개\n` +
        `영상 목록:\n- ${formattedData.videoList}`,
    )
  }

  const submitPlaylist = async (data: PlaylistFormValues, showAlert = true) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // 데이터 형식 변환
      const formatted = formatPlaylistData(data)
      setFormattedData(formatted)

      if (showAlert) {
        showFormattedDataAlert(formatted)
      }

      // TODO: API 호출 구현
      // const response = await apiClient.post('/playlists', data);

      console.log('플레이리스트 제출:', data)

      onSuccess?.()
      return true
    } catch (error) {
      const err = error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.')
      setSubmitError(err)
      onError?.(err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const validatePlaylist = (data: PlaylistFormValues) => {
    const errors: string[] = []

    if (!data.title.trim()) {
      errors.push('제목을 입력해주세요.')
    }

    if (data.videos.length === 0) {
      errors.push('최소 한 개 이상의 영상을 추가해주세요.')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  return {
    submitPlaylist,
    validatePlaylist,
    isSubmitting,
    submitError,
    formattedData,
  }
}
