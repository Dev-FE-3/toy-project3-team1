import { useToastStore, ToastType } from '@/shared/store/toastStore'
import { ToastMessage, ToastMessageType } from '@/shared/components/ToastMessage/ToastMessage'

/**
 * PlaylistForm 기능에 특화된 토스트 컨테이너
 * 이 컴포넌트는 toastStore의 상태를 구독하고 PlaylistForm의 레이아웃에 맞게 토스트를 표시합니다.
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  // 스토어의 ToastType을 ToastMessageType으로 매핑
  // 두 타입은 동일한 값을 가지지만 서로 다른 파일에 정의되어 있어 타입 호환성을 위한 처리가 필요함
  const mapToastType = (type: ToastType): ToastMessageType => type as ToastMessageType

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          type={mapToastType(toast.type)}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
