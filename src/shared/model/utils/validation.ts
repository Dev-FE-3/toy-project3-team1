/**
 * 닉네임 유효성 검사 결과 타입
 */
export interface NicknameValidationResult {
  isValidLength: boolean
  hasLetter: boolean
  isValid: boolean
}

/**
 * 닉네임 유효성 검사 함수
 * @param nickname 검사할 닉네임
 * @returns 유효성 검사 결과 객체
 */
export const validateNickname = (nickname: string): NicknameValidationResult => {
  const isValidLength = nickname.length >= 2 && nickname.length <= 5
  const hasLetter = /[a-zA-Z가-힣]/.test(nickname)
  const isValid = isValidLength && hasLetter

  return {
    isValidLength,
    hasLetter,
    isValid,
  }
}

/**
 * 닉네임 유효성 검사 에러 메시지
 * @param result 유효성 검사 결과 객체
 * @returns 에러 메시지 (유효한 경우 null)
 */
export const getNicknameErrorMessage = (result: NicknameValidationResult): string | null => {
  if (!result.isValidLength) return '닉네임은 2~5자 사이여야 합니다.'
  if (!result.hasLetter) return '문자(영문/한글)를 포함해야 합니다.'
  return null
}
