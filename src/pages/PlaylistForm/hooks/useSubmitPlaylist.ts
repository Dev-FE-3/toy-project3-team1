import { PlaylistFormValues } from '@/pages//PlaylistForm/model/types'
import { useState } from 'react'

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
      thumbnail: data.thumbnail ? '등록됨' : '첫 번째 영상 썸네일 사용',
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

      // FormData 생성
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description || '')
      formData.append('isPublic', String(data.isPublic))
      formData.append('hashtags', JSON.stringify(data.hashtags))
      formData.append('videos', JSON.stringify(data.videos))

      // 썸네일 처리
      if (data.thumbnail) {
        // 사용자가 직접 업로드한 이미지 파일인 경우
        formData.append('thumbnail', data.thumbnail)
        formData.append('thumbnailType', 'file')
      } else if (data.videos.length > 0) {
        // 첫 번째 영상의 썸네일 URL을 사용하는 경우
        formData.append('thumbnail', data.videos[0].thumbnailUrl)
        formData.append('thumbnailType', 'url')
      }

      // 데이터 형식 변환 (표시용)
      const formatted = formatPlaylistData(data)
      setFormattedData(formatted)

      if (showAlert) {
        showFormattedDataAlert(formatted)
      }

      // TODO: API 호출 구현
      // const response = await apiClient.post('/playlists', formData);

      console.log('플레이리스트 제출:', formData)

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

    if (data.title.length > 20) {
      errors.push('제목은 20자를 초과할 수 없습니다.')
    }

    if (data.description && data.description.length > 150) {
      errors.push('설명은 150자를 초과할 수 없습니다.')
    }

    if (data.hashtags.length > 3) {
      errors.push('해시태그는 최대 3개까지만 등록 가능합니다.')
    }

    if (data.videos.length === 0) {
      errors.push('최소 1개 이상의 영상을 등록해주세요.')
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
