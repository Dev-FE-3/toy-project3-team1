// shared/hooks/useNicknameField.ts
import { useState } from 'react'
import { validateNickname } from '@/shared/model/utils/validation'
import { checkNicknameDuplicate } from '../services/nicknameServiece'

export const useNicknameField = (profileId: string, currentNickname: string) => {
  const [nickname, setNickname] = useState(currentNickname)
  const [availability, setAvailability] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle')

  const isValidFormat = validateNickname(nickname).isValid
  const isSameAsCurrent = nickname === currentNickname
  const isChecking = availability === 'checking'
  const isAvailable = availability === 'available'

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setAvailability('idle')
  }

  const checkDuplicate = async () => {
    if (!isValidFormat || isSameAsCurrent) return

    setAvailability('checking')
    try {
      const available = await checkNicknameDuplicate(nickname, profileId)
      setAvailability(available ? 'available' : 'unavailable')
    } catch (err) {
      console.error('닉네임 중복 확인 실패:', err)
      setAvailability('idle')
    }
  }

  const resetNickname = () => {
    setNickname(currentNickname)
    setAvailability('idle')
  }

  return {
    nickname,
    isSameAsCurrent,
    isChecking,
    isAvailable,
    availability,
    isValidFormat,
    handleNicknameChange,
    checkDuplicate,
    resetNickname,
  }
}
