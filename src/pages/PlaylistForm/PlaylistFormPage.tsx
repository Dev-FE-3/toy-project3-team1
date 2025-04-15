import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import {
  FormHeader,
  PlaylistInfoForm,
  TabItem,
  Tabs,
  VideoListForm,
} from '@/pages/PlaylistForm/components'
import { useSubmitPlaylist, useUpdatePlaylistForm } from '@/pages/PlaylistForm/hooks'
import { PlaylistFormValues, playlistFormSchema } from '@/pages/PlaylistForm/model/types'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { useToast } from '@/shared/store/toastStore'
import { useUserStore } from '@/shared/store/userStore'
import { useGetPlaylist } from './queries/usePlaylistQuery'

type FormTab = 'content' | 'video'

const PlaylistFormPage = () => {
  const navigate = useNavigate()
  const { id: playlistId } = useParams<{ id: string }>()
  const isEditMode = !!playlistId
  const profileId = useUserStore((state) => state.profileId)
  const { success, error } = useToast()

  // 수정 모드일 때 기존 데이터 조회
  const { data: playlist, isLoading: isLoadingPlaylist } = useGetPlaylist(playlistId || '')

  // Form hooks
  const { submitPlaylist, validatePlaylist, isSubmitting } = useSubmitPlaylist({
    onError: (err: Error) => error(err.message),
  })

  const { updatePlaylist, isUpdating } = useUpdatePlaylistForm({
    playlistId: playlistId || '',
    onSuccess: () => {
      success('플레이리스트가 성공적으로 수정되었습니다.')
      navigate('/playlists')
    },
    onError: (err: Error) => error(err.message),
  })

  // Form 상태 관리 - mode를 onChange로 설정하여 실시간 검증
  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: {
      title: '',
      description: '',
      hashtags: [],
      isPublic: true,
      videos: [],
      thumbnail: null,
      thumbnailUrl: '',
    },
    mode: 'onChange',
  })

  // 플레이리스트 데이터가 로드되면 폼 업데이트
  useEffect(() => {
    if (playlist && isEditMode) {
      const formValues = {
        title: playlist.title,
        description: playlist.description || '',
        hashtags: playlist.hashtag || [],
        isPublic: playlist.is_public,
        videos: playlist.playlist_items.map((item) => ({
          id: item.video_id,
          title: item.title,
          thumbnailUrl: item.thumbnail_url,
          url: `https://www.youtube.com/watch?v=${item.video_id}`,
        })),
        thumbnail: null,
        thumbnailUrl: playlist.thumbnail_url || '',
      }

      form.reset(formValues, {
        keepDirtyValues: false,
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      })
    }
  }, [playlist, isEditMode, form])

  // 폼 데이터와 상태 접근
  const { watch, formState } = form
  const { errors, dirtyFields } = formState

  // 필요한 폼 값 가져오기
  const title = watch('title') || ''
  const videos = watch('videos') || []

  // 탭 완료 상태 계산 (유효성 검사 결과 기반)
  const isTitleComplete = isEditMode
    ? !!title.trim()
    : !!dirtyFields.title && !errors.title && title.trim().length > 0
  const isVideoComplete = videos.length > 0 && !errors.videos
  const isComplete = isTitleComplete && isVideoComplete

  // 폼 제출 핸들러
  const onSubmit = async (values: PlaylistFormValues) => {
    try {
      if (!profileId) {
        error('사용자 정보를 찾을 수 없습니다.')
        return
      }

      const { isValid, errors: validationErrors } = validatePlaylist(values)
      if (!isValid) {
        error(validationErrors)
        return
      }

      if (isEditMode) {
        await updatePlaylist(values)
      } else {
        const result = await submitPlaylist(values, true)
        if (result) {
          success('플레이리스트가 성공적으로 생성되었습니다.')
          navigate('/playlists')
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.'
      error(errorMessage)
    }
  }

  if (isEditMode && isLoadingPlaylist) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="container mx-auto px-9">
      <FormHeader
        title={isEditMode ? '플레이리스트 수정' : '플레이리스트 등록'}
        onBackButtonClick={isEditMode ? () => navigate('/playlists') : undefined}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-[calc(100vh-200px)] flex-col"
        >
          <Tabs<FormTab>
            defaultKey="content"
            initialStatus={{
              content: isTitleComplete,
              video: isVideoComplete,
            }}
          >
            {({ activeKey, setActiveKey, tabStatus }) => (
              <div className="flex h-full flex-col">
                <div className="text-c100 border-c600 flex justify-between border-b pt-6">
                  <TabItem
                    tabKey="content"
                    label="제목/내용"
                    isActive={activeKey === 'content'}
                    isComplete={tabStatus.content}
                    onClick={() => setActiveKey('content')}
                    className="w-1/2"
                  />
                  <TabItem
                    tabKey="video"
                    label="영상목록"
                    isActive={activeKey === 'video'}
                    isComplete={tabStatus.video}
                    onClick={() => setActiveKey('video')}
                    className="w-1/2"
                  />
                </div>

                <div className="max-h-full min-h-0 flex-1 overflow-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {activeKey === 'content' ? <PlaylistInfoForm /> : <VideoListForm />}
                </div>

                <div className="mt-auto py-4">
                  {/* 메인 액션 버튼 */}
                  <Button
                    type={isComplete ? 'submit' : 'button'}
                    className="bg-c700 text-c100 h-[56px] w-full rounded-md py-2 text-[16px]"
                    disabled={
                      (activeKey === 'content' ? !title : videos.length === 0) ||
                      isSubmitting ||
                      isUpdating
                    }
                    onClick={() => {
                      if (!isComplete) {
                        if (activeKey === 'content' && title.trim()) {
                          setActiveKey('video')
                        } else if (activeKey === 'video' && videos.length > 0) {
                          setActiveKey('content')
                        }
                      }
                    }}
                  >
                    {isComplete
                      ? isEditMode
                        ? isUpdating
                          ? '수정 중...'
                          : '플레이리스트 수정하기'
                        : isSubmitting
                          ? '생성 중...'
                          : '플레이리스트 생성하기'
                      : '다음'}
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </form>
      </Form>
    </div>
  )
}

export default PlaylistFormPage
