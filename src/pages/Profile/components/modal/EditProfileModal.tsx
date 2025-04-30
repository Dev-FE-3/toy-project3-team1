import { useUploadAndSaveProfileImageMutation } from '@/pages/Profile/queries/profileQuery'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useProfileSharedQuery } from '@/shared/queries/profileSharedQuery'
import { useToast } from '@/shared/store/toastStore'
import { useRef, useState } from 'react'
import { useNicknameField } from '../../hooks/useNicknameField'
import { useUpdateNickname } from '../../queries/useUpdateNickname'
import { NicknameField } from './NicknameField'
import { queryClient } from '@/shared/model/lib/queryClient'
import { profileSharedQueryKeys } from '@/shared/queries/profileSharedQueryKeys'
import { Camera } from 'lucide-react'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  profileId: string
  currentNickname: string
}

export const EditProfileModal = ({
  open,
  onClose,
  profileId,
  currentNickname,
}: EditProfileModalProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 닉네임 필드 관련 상태 및 로직
  const {
    nickname,
    availability,
    isChecking,
    isSameAsCurrent,
    isValidFormat,
    handleNicknameChange,
    checkDuplicate,
    resetNickname,
  } = useNicknameField(profileId, currentNickname)

  const { mutateAsync: update } = useUpdateNickname()
  const { data: imageData } = useProfileSharedQuery(profileId)
  const uploadMutation = useUploadAndSaveProfileImageMutation(profileId)
  const { success, error: showError } = useToast()

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }

  // 카메라 버튼 클릭 시 input 트리거
  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  // 닉네임/이미지 저장
  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (file) {
        await uploadMutation.mutateAsync({ file })
      }
      await update({ profileId, nickname })
      await queryClient.invalidateQueries({
        queryKey: profileSharedQueryKeys.image(profileId),
      })
      success('프로필이 성공적으로 변경되었습니다.')
      onClose()
    } catch (error) {
      console.error('프로필 저장 중 오류 발생:', error)
      showError('프로필 저장에 실패했습니다.')
    }
    setIsSaving(false)
  }

  // 모달 닫기
  const handleClose = () => {
    resetNickname()
    setFile(null)
    setPreviewUrl(null)
    onClose()
  }

  // 미리보기 우선, 없으면 initialImageSrc, 없으면 업로드된 이미지
  const imageSrc = previewUrl || (imageData ? `${imageData}?t=${Date.now()}` : undefined)
  const fallbackText = nickname?.slice(0, 2).toUpperCase() ?? ''
  // 저장 버튼 비활성화 조건
  const isDisabled =
    !file && (availability !== 'available' || isSaving || isSameAsCurrent || !isValidFormat)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-c900 border-c700 space-y-2">
        <DialogHeader>
          <DialogTitle className="text-textM text-c50">닉네임 재설정</DialogTitle>
        </DialogHeader>
        <div className="relative">
          {imageSrc && (
            <img src={imageSrc} className="bg-c600 m-auto h-[130px] w-[130px] rounded-[50%]" />
          )}
          {!imageSrc && (
            <div className="text-c400 bg-c600 text-h2 m-auto flex h-[130px] w-[130px] items-center justify-center rounded-[50%]">
              {fallbackText}
            </div>
          )}
          <span
            className="bg-c700/70 text-c100 absolute right-20 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow"
            onClick={(e) => {
              e.stopPropagation()
              handleEditClick?.()
            }}
          >
            <Camera size={20} />
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <NicknameField
          nickname={nickname}
          onChange={handleNicknameChange}
          onCheckDuplicate={checkDuplicate}
          isChecking={isChecking}
          availability={availability}
          isValidFormat={isValidFormat}
          isSameAsCurrent={isSameAsCurrent}
        />

        <DialogFooter className="w-full">
          <Button
            variant="outline"
            type="button"
            className="bg-c700 text-c200 h-12 flex-1"
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            variant="outline"
            className="bg-c300 text-c900 h-12 flex-1"
            onClick={handleSave}
            disabled={isDisabled}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
