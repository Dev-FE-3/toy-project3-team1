import { useState } from 'react'
import { supabase } from '@/shared/model/api/supabase'
import { validateNickname } from '@/shared/model/utils/validation'

// 닉네임 필드 상태와 중복 확인 로직을 관리하는 커스텀 훅
export const useNicknameField = (profileId: string, currentNickname: string) => {
  const [nickname, setNickname] = useState(currentNickname)
  const [availability, setAvailability] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle') // 닉네임 중복 확인 상태

  const isValidFormat = validateNickname(nickname).isValid // 닉네임 형식 유효성 검사 결과
  const isSameAsCurrent = nickname === currentNickname // 기존 닉네임과 동일한지 여부
  const isChecking = availability === 'checking' // 현재 중복 확인 중인지 여부
  const isAvailable = availability === 'available' // 사용 가능한 닉네임인지 여부

  // 닉네임 입력 값이 바뀔 때 호출되는 핸들러
  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setAvailability('idle') // 중복 확인 상태 초기화
  }

  // 닉네임 중복 여부를 Supabase를 통해 확인
  const checkDuplicate = async () => {
    if (!isValidFormat || isSameAsCurrent) return // 유효하지 않거나 기존 닉네임과 같으면 확인 생략

    setAvailability('checking') // 중복 확인 시작

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .neq('id', profileId) // 본인의 닉네임은 제외하고 중복 여부 확인

    if (error) {
      console.error('닉네임 중복 확인 실패:', error.message)
      setAvailability('idle') // 실패 시 상태 초기화
      return
    }

    // 중복 결과에 따라 상태 업데이트
    setAvailability(data.length === 0 ? 'available' : 'unavailable')
  }

  // 필드를 초기 닉네임으로 리셋하는 함수 : 모달을 닫았을 때 사용
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
