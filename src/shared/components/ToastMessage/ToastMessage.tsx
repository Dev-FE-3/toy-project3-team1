import { cn } from '@/shared/model/lib/utils'
import { ToastType } from '@/shared/store/toastStore'
import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const ICONS: Record<ToastType, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
  warning: TriangleAlert,
}

const ICON_STROKE: Record<ToastType, string> = {
  success: 'text-c100',
  error: 'text-c100',
  info: 'text-c100',
  warning: 'text-c100',
}

const ICON_FILL: Record<ToastType, string> = {
  success: 'fill-dark-green',
  error: 'fill-red',
  info: 'fill-blue',
  warning: 'fill-dark-orange',
}

const GRAY_STYLE = { bg: 'bg-gray-600', text: 'text-c100' }

const COLOR_STYLE: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: 'bg-green-100', text: 'text-green-800' },
  error: { bg: 'bg-red-100', text: 'text-red-800' },
  info: { bg: 'bg-blue-100', text: 'text-blue-800' },
  warning: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
}

function getToastColors(type: ToastType, mode: 'default' | 'icon') {
  return mode === 'icon' ? GRAY_STYLE : COLOR_STYLE[type]
}

export interface ToastMessageProps {
  type: ToastType
  message: string | string[]
  duration?: number
  onClose?: () => void
  className?: string
  mode?: 'default' | 'icon'
}

export const ToastMessage = ({
  type,
  message,
  duration = 3000,
  onClose,
  className = '',
  mode = 'default',
}: ToastMessageProps) => {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const messages = Array.isArray(message) ? message : [message]
  const { bg, text } = getToastColors(type, mode)
  const Icon = ICONS[type]

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(handleClose, duration)
    return () => clearTimeout(timer)
  }, [duration, handleClose])

  if (!visible) return null

  return (
    <div
      className={cn(
        'w-88 transform rounded-lg shadow-lg transition-all duration-300 ease-in-out',
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
        bg,
        className,
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={cn('flex items-start p-4', mode === 'icon' && 'items-center')}>
        <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
          <Icon
            className={cn('h-4 w-4', ICON_STROKE[type], ICON_FILL[type])}
            stroke="currentColor"
            fill="currentColor"
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0">
          {mode === 'default' && (
            <div className={cn('mb-1 font-medium', text)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
          )}
          <div className={cn('text-sm', text)}>
            {messages.length > 1 ? (
              <ul className="list-disc space-y-1 pl-5">
                {messages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            ) : (
              messages[0]
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
