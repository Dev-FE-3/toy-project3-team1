import { cn } from '@/shared/model/lib/utils'
import { useToastStore } from '@/shared/store/toastStore'
import { ToastMessage } from './ToastMessage'

interface ToastContainerProps {
  /** Toast가 표시될 위치 */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
  /** 컨테이너와 화면 가장자리 사이의 간격 (px) */

  /** 추가 스타일 클래스 */
  className?: string
  mode?: 'default' | 'icon'
}

const POSITION_STYLES = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-28 left-1/2 -translate-x-1/2',
}

export const ToastContainer = ({ position, className, mode }: ToastContainerProps) => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className={cn(
        'absolute z-50 flex flex-col gap-2',
        position && POSITION_STYLES[position],
        className,
      )}
    >
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          mode={mode}
        />
      ))}
    </div>
  )
}
