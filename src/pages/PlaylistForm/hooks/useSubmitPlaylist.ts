import { useState } from 'react'

import { PlaylistFormValues } from '@/pages//PlaylistForm/model/types'
import {
  useCreatePlaylist,
  useCreatePlaylistItems,
  useUpdateThumbnailUrl,
  useUploadThumbnail,
} from '@/pages/PlaylistForm/queries/usePlaylistQuery'
import { useUserStore } from '@/shared/store/userStore'

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

  // Playlist 생성 및 업로드 관련 mutations
  const createPlaylistMutation = useCreatePlaylist()
  const createPlaylistItemsMutation = useCreatePlaylistItems()
  const uploadThumbnailMutation = useUploadThumbnail()
  const updateThumbnailUrlMutation = useUpdateThumbnailUrl()

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
      setIsSubmitting(true)
      setSubmitError(null)

      const profileId = useUserStore.getState().profileId
      if (!profileId) throw new Error('사용자 정보를 찾을 수 없습니다.')

      // 1. 플레이리스트 생성
      const newPlaylist = await createPlaylistMutation.mutateAsync({
        title: data.title,
        description: data.description || null,
        profile_id: profileId,
        is_public: data.isPublic,
        hashtag: data.hashtags.length ? data.hashtags : undefined,
        thumbnail_url: null,
      })

      // 2. 플레이리스트 아이템 생성
      await createPlaylistItemsMutation.mutateAsync({
        playlistId: newPlaylist.id,
        videos: data.videos,
      })

      // 3. 썸네일 처리
      let thumbnailUrl = ''
      if (data.thumbnail) {
        try {
          // 썸네일 업로드
          thumbnailUrl = await uploadThumbnailMutation.mutateAsync({
            file: data.thumbnail,
            userId: profileId,
            playlistId: newPlaylist.id,
          })
          // 썸네일 URL 업데이트
          await updateThumbnailUrlMutation.mutateAsync({
            playlistId: newPlaylist.id,
            thumbnailUrl,
          })
        } catch (thumbError) {
          setSubmitError(new Error('썸네일 업로드 또는 URL 업데이트 중 오류가 발생했습니다.'))
          throw thumbError
        }
      } else if (data.videos.length > 0) {
        try {
          await updateThumbnailUrlMutation.mutateAsync({
            playlistId: newPlaylist.id,
            thumbnailUrl: data.videos[0].thumbnailUrl,
          })
        } catch (thumbError) {
          setSubmitError(new Error('기본 썸네일 URL 업데이트 중 오류가 발생했습니다.'))
          throw thumbError
        }
      }

      // 데이터 형식 변환 (표시용)
      const formatted = formatPlaylistData(data)
      setFormattedData(formatted)

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
