import { useState } from 'react'

import { supabase } from '@/shared/model/api/supabase'
import { validateNickname } from '@/shared/model/utils/validation'

export const useNicknameField = (profileId: string, currentNickname: string) => {
  const [nickname, setNickname] = useState(currentNickname)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const isSameAsCurrent = nickname === currentNickname
  const validationResult = validateNickname(nickname)
  const isValidFormat = validationResult.isValid

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setIsAvailable(null) // 상태 초기화
  }

  const checkDuplicate = async () => {
    if (!isValidFormat || isSameAsCurrent) return

    setIsChecking(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .neq('id', profileId) // 해당 사용자의 닉네임을 setIsAvailable에서 제외

    if (error) {
      alert('중복 확인 실패: ' + error.message)
      setIsAvailable(null)
    } else {
      setIsAvailable(data.length === 0)
    }

    setIsChecking(false)
  }

  const initNicknameField = () => {
    setNickname(currentNickname)
    setIsAvailable(null)
  }

  return {
    nickname,
    isAvailable,
    isChecking,
    isSameAsCurrent,
    isValidFormat,
    ...validationResult,
    initNicknameField,
    handleNicknameChange,
    checkDuplicate,
  }
}
