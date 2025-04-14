import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  FormHeader,
  PlaylistInfoForm,
  TabItem,
  Tabs,
  VideoListForm,
} from '@/pages/PlaylistForm/components'
import { useSubmitPlaylist } from '@/pages/PlaylistForm/hooks'
import { PlaylistFormValues, playlistFormSchema } from '@/pages/PlaylistForm/model/types'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { useToast } from '@/shared/store/toastStore'

type FormTab = 'content' | 'video'

const PlaylistFormPage = () => {
  const navigate = useNavigate()

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
    },
    mode: 'onChange', // 입력 변경 시 즉시 검증
  })

  // 폼 데이터와 상태 접근
  const { watch, formState } = form
  const { errors, dirtyFields } = formState

  // 필요한 폼 값 가져오기
  const title = watch('title') || ''
  const videos = watch('videos') || []

  // 탭 완료 상태 계산 (유효성 검사 결과 기반)
  const isTitleComplete = !!dirtyFields.title && !errors.title && title.trim().length > 0
  const isVideoComplete = videos.length > 0 && !errors.videos
  const isComplete = isTitleComplete && isVideoComplete

  // 사용자 피드백 및 네비게이션
  const { submitPlaylist, validatePlaylist } = useSubmitPlaylist()
  const { success, error } = useToast()

  // 폼 제출 핸들러
  const onSubmit = async (values: PlaylistFormValues) => {
    try {
      const { isValid, errors } = validatePlaylist(values)
      if (!isValid) {
        error(errors)
        return
      }

      const result = await submitPlaylist(values, false) // alert 표시 비활성화
      if (result) {
        success('플레이리스트가 성공적으로 생성되었습니다.')
        navigate('/playlists')
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.'
      error(errorMessage)
    }
  }

  return (
    <div className="container mx-auto px-9">
      <FormHeader title="플레이리스트 등록" />

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
                    disabled={activeKey === 'content' ? !title : videos.length === 0}
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
                    {isComplete ? '플레이리스트 생성하기' : '다음'}
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
