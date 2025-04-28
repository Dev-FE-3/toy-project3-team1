import { mapErrorMessage } from '@/shared/model/utils/mapErrorMessage'
import { toast } from '@/shared/model/utils/toast'
import { MutationCache, QueryClient } from '@tanstack/react-query'
// QueryClient 기본 설정
export const queryClient = new QueryClient({
  // 모든 useMutation 공통 후킹 지점
  mutationCache: new MutationCache({
    // 실패한 경우: meta.toast 플래그가 있을 때만 알림
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.toastError) {
        const rawMsg = mutation.meta.toastErrorMessage
        const fallbackMsg = mapErrorMessage(error)
        const customMsg = typeof rawMsg === 'string' || Array.isArray(rawMsg) ? rawMsg : fallbackMsg

        toast.error(customMsg)
      }
    },

    // 성공 알림 예시 (옵션)
    onSuccess: (_data, _vars, _ctx, mutation) => {
      if (mutation.meta?.toastSuccess) {
        const rawMsg = mutation.meta.toastSuccessMessage
        const customMsg = typeof rawMsg === 'string' ? rawMsg : '처리가 완료되었습니다!'
        toast.success(customMsg)
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스시 자동으로 데이터를 다시 가져오지 않음
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터는 "최신" 상태로 간주
      gcTime: 30 * 60 * 1000, // 30분 동안 데이터는 가비지 컬렉션 대상으로 간주
      retry: 2, // 실패시 1번만 재시도
      retryDelay: 1000, // 1초 대기 후 재시도
    },
  },
})
