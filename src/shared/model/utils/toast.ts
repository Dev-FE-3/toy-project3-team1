import type { ToastType } from '@/shared/store/toastStore'
import { useToastStore } from '@/shared/store/toastStore'

/**
 * 내부 헬퍼: 훅 없이 zustand 상태에 직접 접근
 */
function push(type: ToastType, message: string | string[], duration = 3000) {
  useToastStore.getState().addToast({ type, message, duration })
}

/**
 * 전역 어디서든 import 후 호출 가능한 유틸
 *  - React 훅 호출 규칙과 무관
 *  - QueryClient, axios interceptor 등에서도 사용 가능
 */
export const toast = {
  success: (msg: string | string[], d?: number) => push('success', msg, d),
  error: (msg: string | string[], d?: number) => push('error', msg, d),
  info: (msg: string | string[], d?: number) => push('info', msg, d),
  warning: (msg: string | string[], d?: number) => push('warning', msg, d),
}
