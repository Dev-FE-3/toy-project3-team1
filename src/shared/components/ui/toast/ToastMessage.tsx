import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { ToastType } from '@/shared/store/toastStore'

/**
 * 토스트 메시지의 스타일 설정을 위한 인터페이스
 */
export interface ToastStyle {
  bgColor: string // 배경색 클래스명
  icon: string // 아이콘 문자
  textColor: string // 텍스트 색상
}

/**
 * 토스트 메시지 타입별 스타일 매핑
 */
const TOAST_STYLES: Record<ToastType, ToastStyle> = {
  success: {
    bgColor: 'bg-green-100',
    icon: '✓',
    textColor: 'text-green-800',
  },
  error: {
    bgColor: 'bg-red-100',
    icon: '✕',
    textColor: 'text-red-800',
  },
  info: {
    bgColor: 'bg-blue-100',
    icon: 'ℹ',
    textColor: 'text-blue-800',
  },
  warning: {
    bgColor: 'bg-yellow-100',
    icon: '⚠',
    textColor: 'text-yellow-800',
  },
}

/**
 * 토스트 메시지 컴포넌트의 props 인터페이스
 */
export interface ToastMessageProps {
  /** 토스트 메시지 타입 */
  type: ToastType
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
  const { bgColor, icon, textColor } = TOAST_STYLES[type]

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 300)
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
      className={`transform rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} ${bgColor} ${className} `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start p-4">
        <div className={`mr-3 flex-shrink-0 ${textColor}`}>
          <span className="text-xl" aria-hidden="true">
            {icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className={`mb-1 font-medium ${textColor}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
          <div className={`text-sm ${textColor}`}>
            {messages.length > 1 ? (
              <ul className="list-disc space-y-1 pl-5">
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
          className={`ml-4 flex-shrink-0 hover:opacity-75 focus:ring-2 focus:ring-offset-2 focus:outline-none ${textColor} rounded`}
          aria-label="닫기"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  )
}
