import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { queryClient } from '@/shared/model/lib/queryClient'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { NicknameField } from './NicknameField'
import { useNicknameField } from '../../hooks/useNicknameField'
import { updateNickname } from '@/shared/model/api/auth'

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

  // 저장 버튼 비활성화 조건
  const isDisabled = availability !== 'available' || isSaving || isSameAsCurrent || !isValidFormat

  // 닉네임 저장
  const handleSave = async () => {
    if (isDisabled) return

    setIsSaving(true)

    try {
      const success = await updateNickname(profileId, nickname) // 닉네임 업데이트

      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['profile', profileId] }) // 캐시 무효화 & 쿼리 재요청
        onClose()
      } else {
        alert('닉네임 변경 실패')
      }
    } catch (error) {
      console.error('닉네임 업데이트 중 오류 발생:', error)
      alert('닉네임 변경 실패: ')
    }

    setIsSaving(false)
  }

  // 모달 닫기
  const handleClose = () => {
    resetNickname()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-c900 border-c700 space-y-2">
        <DialogHeader>
          <DialogTitle className="text-textM text-c50">닉네임 재설정</DialogTitle>
        </DialogHeader>

        <UserCard nickname={nickname} size="large" className="m-auto mb-3" />

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
