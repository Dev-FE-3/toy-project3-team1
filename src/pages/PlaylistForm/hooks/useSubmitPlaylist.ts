import { useState } from 'react'

import { PlaylistFormValues } from '@/pages//PlaylistForm/model/types'
import { useSubmitPlaylistMutation } from '@/pages/PlaylistForm/queries/usePlaylistQuery'

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
  const [formattedData, setFormattedData] = useState<FormattedPlaylistData | null>(null)
  const submitPlaylistMutation = useSubmitPlaylistMutation()

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

  const submitPlaylist = async (data: PlaylistFormValues) => {
    try {
      await submitPlaylistMutation.mutateAsync(data)

      // 데이터 형식 변환 (표시용)
      const formatted = formatPlaylistData(data)
      setFormattedData(formatted)

      onSuccess?.()
      return true
    } catch (error) {
      const err = error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.')
      onError?.(err)
      return false
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
    isSubmitting: submitPlaylistMutation.isPending,
    submitError: submitPlaylistMutation.error as Error | null,
    formattedData,
  }
}
