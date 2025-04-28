import { useUploadAndSaveProfileImageMutation } from '@/pages/Profile/queries/profileQuery'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { useProfileSharedQuery } from '@/shared/queries/profileSharedQuery'
import { useRef, useState } from 'react'
import { useNicknameField } from '../../hooks/useNicknameField'
import { useUpdateNickname } from '../../queries/useUpdateNickname'
import { NicknameField } from './NicknameField'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  profileId: string
  currentNickname: string
  initialImageSrc?: string
}

export const EditProfileModal = ({
  open,
  onClose,
  profileId,
  currentNickname,
  initialImageSrc,
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
  const uploadedUrl = imageData ?? undefined
  const uploadMutation = useUploadAndSaveProfileImageMutation(profileId)

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
      window.location.reload()
    } catch (error) {
      console.error('프로필 저장 중 오류 발생:', error)
      alert('프로필 저장 실패')
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
  const imageSrc =
    previewUrl || initialImageSrc || (uploadedUrl ? `${uploadedUrl}?t=${Date.now()}` : undefined)

  // 저장 버튼 비활성화 조건
  const isDisabled =
    !file && (availability !== 'available' || isSaving || isSameAsCurrent || !isValidFormat)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-c900 border-c700 space-y-2">
        <DialogHeader>
          <DialogTitle className="text-textM text-c50">닉네임 재설정</DialogTitle>
        </DialogHeader>

        <UserCard
          nickname={nickname}
          size="large"
          className="m-auto mb-3"
          showEditButton={true}
          onEditClick={handleEditClick}
          imageSrc={imageSrc}
        />
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
