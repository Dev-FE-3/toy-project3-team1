import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { supabase } from '@/shared/model/api/supabase'
import { queryClient } from '@/shared/model/lib/queryClient'
import { UserCard } from '@/shared/components/UserCard/UserCard'

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
  const [nickname, setNickname] = useState(currentNickname)
  const [isSaving, setIsSaving] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const isSameAsCurrent = nickname === currentNickname
  const isValidFormat = /^[a-zA-Z0-9가-힣]+$/.test(nickname)

  const handleCheckDuplicate = async () => {
    if (!isValidFormat || isSameAsCurrent) return

    setIsChecking(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .neq('id', profileId)

    if (error) {
      alert('중복 확인 실패: ' + error.message)
      setIsAvailable(null)
    } else {
      setIsAvailable(data.length === 0)
    }
    setIsChecking(false)
  }

  const handleSave = async () => {
    if (!isAvailable || isSameAsCurrent || !isValidFormat) return

    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ nickname }).eq('id', profileId)

    if (!error) {
      await queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      onClose()
    } else {
      alert('닉네임 변경 실패: ' + error.message)
    }
    setIsSaving(false)
  }

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setIsAvailable(null) // 변경 시 중복 상태 초기화
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-c700 space-y-4">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <UserCard nickname={nickname} size="large" className="m-auto" />

        <div className="text-c200 flex gap-2">
          <div className="w-full">
            <Input
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              placeholder="새 닉네임 입력"
              className="text-c900 mb-1"
            />

            {/* 상태 메시지 우선 표시 */}
            {isValidFormat && isSameAsCurrent && (
              <p className="text-captionM text-c200">현재 닉네임입니다.</p>
            )}
            {isValidFormat && !isSameAsCurrent && isAvailable === false && (
              <p className="text-red text-captionM">이미 사용 중인 닉네임입니다.</p>
            )}
            {isValidFormat && isAvailable === true && !isSameAsCurrent && (
              <p className="text-dark-green text-captionM">사용 가능한 닉네임입니다.</p>
            )}

            {/* 상태 메시지가 아무것도 없을 때만 보이게 */}
            {isAvailable === null && !isSameAsCurrent && isValidFormat === true && (
              <p className="text-captionM text-c400 mt-1">공백과 특수기호를 포함할 수 없습니다.</p>
            )}
            {isValidFormat === false && (
              <p className="text-red text-captionM">공백과 특수기호를 포함할 수 없습니다.</p>
            )}
          </div>

          <Button
            variant="outline"
            type="button"
            className="bg-c600 text-captionM h-12 w-20"
            onClick={handleCheckDuplicate}
            disabled={isChecking || !isValidFormat || isSameAsCurrent}
          >
            중복 확인
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            className="bg-c600 text-c200 h-12 w-20"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="outline"
            className="bg-c600 text-c200 h-12 w-20"
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
