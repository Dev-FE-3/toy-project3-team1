import { useFormContext } from 'react-hook-form'
import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { X, ImageIcon } from 'lucide-react'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import { Badge } from '@/shared/components/ui/badge'
import { PlaylistFormValues } from '@/pages/PlaylistForm/model/types'

// 설명란 Textarea의 스타일을 오버라이드하기 위한 CSS 클래스
const textareaStyles = `
  .fixed-height-textarea {
    resize: none; /* 사용자가 크기 조절 불가 */
    height: 80px; /* 고정 높이 */
    min-height: 80px; /* 최소 높이도 동일하게 설정 */
    font-size: 1rem; /* 텍스트 크기를 제목과 동일하게 설정 */
  }
`

export const PlaylistInfoForm = () => {
  const { control, setValue, watch } = useFormContext<PlaylistFormValues>()

  // 폼 필드 값 감시
  const title = watch('title') || ''
  const description = watch('description') || ''
  const hashtags = watch('hashtags') || []

  // 로컬 상태
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [hashtagInput, setHashtagInput] = useState('')
  const [titleCount, setTitleCount] = useState(0)
  const [descriptionCount, setDescriptionCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 글자수 카운트 업데이트
  useEffect(() => {
    setTitleCount(title.length)
  }, [title])

  useEffect(() => {
    setDescriptionCount(description.length)
  }, [description])

  // 글자수 상태 확인
  const isTitleValid = titleCount > 0 && titleCount <= 20

  // =================== 썸네일 관련 함수 ===================
  // 썸네일 클릭 처리
  const handleThumbnailClick = () => fileInputRef.current?.click()

  // 썸네일 제거
  const removeThumbnail = () => {
    setThumbnailPreview(null)
    setValue('thumbnail', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // 썸네일 파일 변경 처리
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 체크
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('JPG, JPEG, PNG 파일만 업로드 가능합니다.')
      return
    }

    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
      setValue('thumbnail', file)
    }
    reader.readAsDataURL(file)
  }

  // =================== 해시태그 관련 함수 ===================
  // 해시태그 키 입력 처리
  const handleHashtagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addHashtag()
    }
  }

  // 해시태그 추가
  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '')

    // 유효성 검사
    if (!tag || hashtags.length >= 3 || tag.length > 20) return
    if (hashtags.includes(tag)) return

    setValue('hashtags', [...hashtags, tag])
    setHashtagInput('')
  }

  // 해시태그 제거
  const removeHashtag = (tagToRemove: string) => {
    setValue(
      'hashtags',
      hashtags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* CSS 스타일 주입 */}
      <style>{textareaStyles}</style>

      {/* 공개 여부 */}
      <section aria-labelledby="public-setting">
        <h3 id="public-setting" className="sr-only">
          공개 여부 설정
        </h3>
        <FormField
          control={control}
          name="isPublic"
          render={({ field }) => (
            <FormItem style={{ gap: 0 }} className="mb-2">
              <div className="text-c100 flex justify-between">
                <FormLabel className="text-base leading-relaxed font-medium">공개여부</FormLabel>
                <div className="flex items-center">
                  <span className="pr-2.5">{field.value ? '공개' : '비공개'}</span>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="공개 여부 설정"
                      className="data-[state=checked]:bg-c600 data-[state=unchecked]:bg-c400 h-[30px] w-[55px]"
                      thumbClassName="h-[25px] w-[25px] data-[state=checked]:translate-x-[27.5px] data-[state=unchecked]:translate-x-[2.5px]"
                    />
                  </FormControl>
                </div>
              </div>
              <FormDescription className="text-c500">
                {field.value ? '모든 사용자가 검색하고 볼 수 있습니다.' : '본인만 볼 수 있습니다.'}
              </FormDescription>
            </FormItem>
          )}
        />
      </section>

      {/* 제목 입력 */}
      <section aria-labelledby="title-input">
        <h3 id="title-input" className="sr-only">
          제목 입력
        </h3>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="mb-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-c100 text-base leading-relaxed font-medium">
                  제목 <span className="text-dark-orange text-sm">*제목은 필수 입력입니다.</span>
                </FormLabel>
                <span
                  className={`text-sm ${
                    titleCount > 20 ? 'text-red-500' : isTitleValid ? 'text-green-500' : 'text-c500'
                  }`}
                >
                  {titleCount}/20
                </span>
              </div>
              <FormControl>
                <Input
                  className="rounded-md bg-[#E4E4E7]"
                  placeholder="제목을 입력해주세요. (20자 제한)"
                  maxLength={20}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </section>

      {/* 설명 입력 - 줄바꿈 지원 */}
      <section aria-labelledby="description-input">
        <h3 id="description-input" className="sr-only">
          설명 입력
        </h3>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-c100 text-base leading-relaxed font-medium">
                  설명
                </FormLabel>
                <span
                  className={`text-sm ${
                    descriptionCount > 150
                      ? 'text-red-500'
                      : descriptionCount > 0
                        ? 'text-green-500'
                        : 'text-c500'
                  }`}
                >
                  {descriptionCount}/150
                </span>
              </div>
              <FormControl>
                <Textarea
                  className="fixed-height-textarea rounded-md bg-[#E4E4E7] text-base"
                  placeholder="플레이리스트 설명을 입력해주세요. (150자 제한)"
                  rows={3}
                  maxLength={150}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </section>

      {/* 해시태그 입력 */}
      <section aria-labelledby="hashtag-input">
        <h3 id="hashtag-input" className="sr-only">
          해시태그 입력
        </h3>
        <FormField
          control={control}
          name="hashtags"
          render={() => (
            <FormItem className="mb-2">
              <FormLabel className="text-c100 text-base leading-relaxed font-medium">
                해시태그{' '}
                <span className="text-c500 text-sm">
                  *20자 제한, 최대 3개까지 등록이 가능합니다.
                </span>
              </FormLabel>
              <FormControl>
                <div className="space-y-1">
                  <div className="flex gap-[10px]">
                    <Input
                      className="rounded-md bg-[#E4E4E7]"
                      placeholder="# 해시태그를 입력해주세요."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={handleHashtagKeyDown}
                      maxLength={20}
                      disabled={hashtags.length >= 3}
                    />
                    <Button
                      type="button"
                      onClick={addHashtag}
                      disabled={!hashtagInput.trim() || hashtags.length >= 3}
                      className="bg-c100 text-c900 flex h-12 min-w-12 items-center justify-center rounded-xl p-2"
                    >
                      추가
                    </Button>
                  </div>
                  <div className="max-w-full overflow-x-auto">
                    <div className="flex min-h-[36px] flex-wrap gap-2 pb-2">
                      {hashtags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-c600 text-c100 border-c300 flex items-center border px-2 py-1 text-xs"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeHashtag(tag)}
                            className="hover:text-c500 ml-1"
                            aria-label={`${tag} 해시태그 삭제`}
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </section>

      {/* 썸네일 등록 - UI 개선 */}
      <section aria-labelledby="thumbnail-upload">
        <h3 id="thumbnail-upload" className="sr-only">
          썸네일 등록
        </h3>
        <FormField
          control={control}
          name="thumbnail"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-c100 text-base leading-relaxed font-medium">
                  썸네일 등록
                </FormLabel>
                <div className="bg-c300 rounded-xl p-3">
                  <FormControl>
                    <div className="relative mx-auto aspect-video w-full max-w-[280px]">
                      <div
                        className={`h-full w-full border ${thumbnailPreview ? 'border-solid' : 'border-dashed'} bg-muted flex cursor-pointer items-center justify-center overflow-hidden rounded-md`}
                        onClick={handleThumbnailClick}
                      >
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="썸네일 미리보기"
                            className="h-full w-full rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <ImageIcon size={24} className="text-c500" />
                            <span className="text-c500 text-sm">이미지 업로드</span>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => {
                            handleThumbnailChange(e)
                            field.onChange(e.target.files?.[0] || null)
                          }}
                        />
                      </div>
                      {thumbnailPreview && (
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="bg-c900 bg-opacity-70 hover:bg-opacity-100 absolute top-2 right-2 rounded-full p-1 text-white"
                          aria-label="썸네일 삭제"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-c500 mt-2 text-center text-[10px]">
                    5MB 미만의 JPG, JPEG, PNG 파일만 등록 가능(권장 해상도: 1280×720)
                  </FormDescription>
                </div>
              </FormItem>
            )
          }}
        />
      </section>
    </div>
  )
}
