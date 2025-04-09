import { useFormContext } from 'react-hook-form'

import { VideoItem } from '@/pages/PlaylistForm/components/VideoItem'
import { useDragAndDrop, useVideoManagement } from '@/pages/PlaylistForm/hooks'
import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'
import { Button } from '@/shared/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

export const VideoListForm = () => {
  const { control, watch, setValue } = useFormContext<PlaylistFormValues>()
  const videosWatch = watch('videos')
  const videos = videosWatch || []

  // 비디오 관리 훅 사용
  const {
    videoUrl,
    isLoading,
    errorMessage,
    handleUrlChange,
    handleKeyPress,
    handleAddVideo,
    handleRemoveVideo,
  } = useVideoManagement({
    videos,
    onVideosChange: (newVideos) => setValue('videos', newVideos),
  })

  // 드래그 앤 드롭 훅 사용
  const { handleDragStart, handleDragEnd, handleDrop, handleDragOver, handleDragLeave } =
    useDragAndDrop({
      items: videos,
      onItemsReorder: (newVideos) => setValue('videos', newVideos),
    })

  // 비디오 목록을 렌더링하는 함수
  const renderVideoList = () => {
    if (videos.length === 0) {
      return (
        <div className="flex w-full justify-center py-8">
          <span className="text-c100 text-sm">등록된 영상이 없습니다.</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {videos.map((video, index) => (
          <VideoItem
            key={video.id}
            id={video.id}
            title={video.title}
            index={index}
            onRemove={() => handleRemoveVideo(index)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <FormField
        control={control}
        name="videos"
        render={() => (
          <FormItem>
            <FormLabel className="text-c100 text-base leading-relaxed font-medium">
              영상 URL 추가
            </FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  className="text-c900 rounded-md bg-[#E4E4E7]"
                  placeholder="동영상 URL을 입력해주세요"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddVideo}
                  className="bg-c100 text-c900 flex h-12 min-w-12 items-center justify-center rounded-xl p-2"
                  disabled={!videoUrl || isLoading}
                >
                  {isLoading ? '로딩중...' : '추가'}
                </Button>
              </div>
            </FormControl>
            {errorMessage && <p className="text-red mt-1 text-sm">{errorMessage}</p>}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-c100 text-base font-medium">영상 목록</p>
          <span className="text-c300 text-sm">
            {videos.length > 0 ? `${videos.length}개의 영상` : ''}
          </span>
        </div>

        {renderVideoList()}
      </div>
    </div>
  )
}
