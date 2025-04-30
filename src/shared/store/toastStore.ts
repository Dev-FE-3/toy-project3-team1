import { create } from 'zustand'

/**
 * 토스트 메시지 타입
 * UI 컴포넌트와 일관성을 유지하되 의존성 없이 정의
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * 토스트 메시지 데이터 구조
 */
export interface Toast {
  /** 고유 식별자 */
  id: string
  /** 토스트 타입 */
  type: ToastType
  /** 메시지 내용 */
  message: string | string[]
  /** 노출 시간 (밀리초) */
  duration?: number
}

/**
 * 새 토스트 생성을 위한 입력 타입
 */
export type ToastInput = Omit<Toast, 'id'>

/**
 * 토스트 스토어 상태 인터페이스
 */
interface ToastState {
  /** 현재 활성화된 토스트 목록 */
  toasts: Toast[]
  /** 새 토스트 추가 */
  addToast: (toast: ToastInput) => string
  /** 토스트 제거 */
  removeToast: (id: string) => void
  /** 모든 토스트 제거 */
  clearToasts: () => void
}

/**
 * 토스트 메시지 관리 스토어
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now().toString()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}))

/**
 * 토스트 메시지 사용을 위한 편의 훅
 */
export const useToast = () => {
  const { addToast } = useToastStore()

  return {
    /**
     * 일반 토스트 메시지 표시
     */
    show: (type: ToastType, message: string | string[], duration = 3000) =>
      addToast({ type, message, duration }),

    /**
     * 성공 메시지 표시
     */
    success: (message: string | string[], duration = 3000) =>
      addToast({ type: 'success', message, duration }),

    /**
     * 오류 메시지 표시
     */
    error: (message: string | string[], duration = 3000) =>
      addToast({ type: 'error', message, duration }),

    /**
     * 정보 메시지 표시
     */
    info: (message: string | string[], duration = 3000) =>
      addToast({ type: 'info', message, duration }),

    /**
     * 경고 메시지 표시
     */
    warning: (message: string | string[], duration = 3000) =>
      addToast({ type: 'warning', message, duration }),
  }
}
