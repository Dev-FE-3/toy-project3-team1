import { useState, useEffect, useCallback } from 'react'
import { XIcon } from 'lucide-react'

/**
 * 토스트 메시지 타입을 정의합니다.
 * - success: 성공 메시지 (녹색)
 * - error: 오류 메시지 (빨간색)
 * - info: 정보 메시지 (파란색)
 * - warning: 경고 메시지 (노란색)
 */
export type ToastMessageType = 'success' | 'error' | 'info' | 'warning'

/**
 * 토스트 메시지의 스타일 설정을 위한 인터페이스
 */
export interface ToastStyle {
  bgColor: string // 배경색 클래스명
  icon: string // 아이콘 문자
}

/**
 * 토스트 메시지 타입별 스타일 매핑
 */
const TOAST_STYLES: Record<ToastMessageType, ToastStyle> = {
  success: {
    bgColor: 'bg-green-600',
    icon: '✓',
  },
  error: {
    bgColor: 'bg-red-600',
    icon: '✕',
  },
  info: {
    bgColor: 'bg-blue-600',
    icon: 'ℹ',
  },
  warning: {
    bgColor: 'bg-yellow-600',
    icon: '⚠',
  },
}

/**
 * 토스트 메시지 컴포넌트의 props 인터페이스
 */
export interface ToastMessageProps {
  /** 토스트 메시지 타입 */
  type: ToastMessageType
  /** 표시할 메시지 (문자열 또는 문자열 배열) */
  message: string | string[]
  /** 토스트가 자동으로 닫히는 시간 (ms) */
  duration?: number
  /** 닫기 버튼 클릭 시 호출될 함수 */
  onClose?: () => void
  /** 추가 CSS 클래스 */
  className?: string
}

export const ToastMessage = ({
  type,
  message,
  duration = 5000,
  onClose,
  className = '',
}: ToastMessageProps) => {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const messages = Array.isArray(message) ? message : [message]

  const { bgColor, icon } = TOAST_STYLES[type]

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 300) // transition 시간과 동일하게 설정
  }, [onClose])

  // 자동으로 닫히는 로직
  useEffect(() => {
    if (duration <= 0) return

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  if (!visible) return null

  return (
    <div
      className={`transform rounded-md p-4 text-white shadow-lg transition-all duration-300 ease-in-out ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} ${bgColor} ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start">
        <div className="mr-2 flex-shrink-0">
          <span className="text-xl" aria-hidden="true">
            {icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="mb-1 font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
          <div className="text-sm">
            {messages.length > 1 ? (
              <ul className="list-disc pl-5">
                {messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              messages[0]
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="focus:ring-opacity-50 ml-2 flex-shrink-0 text-white hover:text-gray-200 focus:ring-2 focus:ring-white focus:outline-none"
          aria-label="닫기"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  )
}
