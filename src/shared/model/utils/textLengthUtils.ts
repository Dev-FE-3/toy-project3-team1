interface TextCountResult {
  text: string
  count: number
}

/**
 * 입력된 텍스트의 길이를 제한하고 현재 글자수를 반환하는 유틸리티 함수
 * @param text 입력된 텍스트
 * @param maxLength 최대 길이
 * @returns 제한된 텍스트와 현재 글자수
 */
export const limitTextLength = (text: string, maxLength: number): TextCountResult => {
  const trimmedText = text.trim()
  if (trimmedText.length > maxLength) {
    return {
      text: trimmedText.slice(0, maxLength),
      count: maxLength,
    }
  }
  return {
    text: trimmedText,
    count: trimmedText.length,
  }
}

/**
 * 글자수 표시를 위한 CSS 클래스를 반환하는 유틸리티 함수
 * @param count 현재 글자수
 * @returns CSS 클래스명
 */
export const getCountStyleClass = (count: number): string => {
  return `text-captionM ${count > 0 ? 'text-green-500' : 'text-c500'}`
}
