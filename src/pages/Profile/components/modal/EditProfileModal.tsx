import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { supabase } from '@/shared/model/api/supabase'
import { queryClient } from '@/shared/model/lib/queryClient'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { NicknameField } from './NicknameField'
import { useNicknameField } from '../../hooks/useNicknameField'

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

  // 닉네임 중복 체크, 현재 닉네임과 동일한지 체크, 유효성 검사
  const {
    nickname,
    isAvailable,
    isChecking,
    isSameAsCurrent,
    isValidFormat,
    handleNicknameChange,
    checkDuplicate,
    initNicknameField,
  } = useNicknameField(profileId, currentNickname)

  // 닉네임 저장
  const handleSave = async () => {
    if (!isAvailable || isSameAsCurrent || !isValidFormat) return

    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ nickname }).eq('id', profileId)

    if (!error) {
      // 바뀐 닉네임이 렌더될 수 있도록 패치
      await queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      onClose()
    } else {
      alert('닉네임 변경 실패: ' + error.message)
    }
    setIsSaving(false)
  }

  const handleClose = () => {
    initNicknameField() // 모달 닫으면 사용자가 입력했던 닉네임 현재 닉네임으로 초기화
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
          isAvailable={isAvailable}
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
            disabled={!isAvailable || isSaving || isSameAsCurrent || !isValidFormat}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
