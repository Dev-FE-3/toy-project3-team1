import { zodResolver } from '@hookform/resolvers/zod'
import { Suspense, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import {
  FormHeader,
  FormLoadingFallback,
  PlaylistInfoForm,
  TabItem,
  Tabs,
  VideoListForm,
} from '@/pages/PlaylistForm/components'
import { useSubmitPlaylist, useUpdatePlaylistForm } from '@/pages/PlaylistForm/hooks'
import { PlaylistFormValues, playlistFormSchema } from '@/pages/PlaylistForm/model/types'
import { useGetPlaylistQuery } from '@/pages/PlaylistForm/queries/playlistQuery'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { useToast } from '@/shared/store/toastStore'
import { useUserStore } from '@/shared/store/userStore'

type FormTab = 'content' | 'video'

const PlaylistFormContent = () => {
  const navigate = useNavigate()
  const { id: playlistId } = useParams<{ id: string }>()
  const isEditMode = !!playlistId
  const profileId = useUserStore((state) => state.profileId)
  const { error } = useToast()

  // Form hooks
  const { validatePlaylist, mutate: submitPlaylist, isPending: isSubmitting } = useSubmitPlaylist()
  const { mutate: updatePlaylist, isPending: isUpdating } = useUpdatePlaylistForm({
    playlistId: playlistId || '',
  })

  // 수정 모드일 때 기존 데이터 조회
  const { data: playlist, isLoading: isLoadingPlaylist } = useGetPlaylistQuery(playlistId || '')

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
        // 수정 모드: updatePlaylist mutation 호출
        updatePlaylist(values)
      } else {
        // 생성 모드: submitPlaylist mutation 호출
        submitPlaylist(values)
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.'
      error(errorMessage)
    }
  }

  const getButtonText = (
    isComplete: boolean,
    isEditMode: boolean,
    isUpdating: boolean,
    isSubmitting: boolean,
  ) => {
    if (!isComplete) return '다음'

    if (isEditMode) {
      return isUpdating ? '리플레이 만드는 중' : '플레이리스트 수정하기'
    }

    return isSubmitting ? '리플레이 만드는 중' : '플레이리스트 생성하기'
  }

  const handleButtonClick = (
    isComplete: boolean,
    activeKey: FormTab,
    title: string,
    videos: PlaylistFormValues['videos'],
    setActiveKey: (key: FormTab) => void,
  ) => {
    if (!isComplete) {
      if (activeKey === 'content' && title.trim()) {
        setActiveKey('video')
      } else if (activeKey === 'video' && videos.length > 0) {
        setActiveKey('content')
      }
    }
  }

  const getButtonDisabled = (
    activeKey: FormTab,
    title: string,
    videos: PlaylistFormValues['videos'],
    isSubmitting: boolean,
    isUpdating: boolean,
  ) => {
    return (activeKey === 'content' ? !title : videos.length === 0) || isSubmitting || isUpdating
  }

  if (isEditMode && isLoadingPlaylist) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="container mx-auto flex h-full flex-col overflow-hidden px-4">
      <Form {...form}>
        <FormHeader
          title={isEditMode ? '플레이리스트 수정' : '플레이리스트 등록'}
          onBackButtonClick={isEditMode ? () => navigate('/playlists') : undefined}
        />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Tabs<FormTab>
            defaultKey="content"
            tabStatus={{
              content: isTitleComplete,
              video: isVideoComplete,
            }}
          >
            {({ activeKey, setActiveKey, tabStatus }) => (
              <div className="flex h-full flex-col justify-between">
                <div className="text-c100 border-c600 flex h-10 border-b pt-2">
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

                {/* 폼 컨텐츠 */}
                <div className="no-scrollbar flex flex-1 flex-col overflow-y-scroll pt-3">
                  {activeKey === 'content' ? <PlaylistInfoForm /> : <VideoListForm />}
                </div>

                {/* 하단 버튼 */}
                <div className="py-4">
                  <Button
                    type={isComplete ? 'submit' : 'button'}
                    className="bg-c700 text-c100 text-textM h-12 w-full rounded-md py-2"
                    disabled={getButtonDisabled(activeKey, title, videos, isSubmitting, isUpdating)}
                    onClick={() =>
                      handleButtonClick(isComplete, activeKey, title, videos, setActiveKey)
                    }
                  >
                    {getButtonText(isComplete, isEditMode, isUpdating, isSubmitting)}
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

export const PlaylistFormPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FormLoadingFallback />}>
        <PlaylistFormContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default PlaylistFormPage
