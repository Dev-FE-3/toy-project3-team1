import { QueryClient } from '@tanstack/react-query'

// QueryClient 기본 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스시 자동으로 데이터를 다시 가져오지 않음
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터는 "최신" 상태로 간주
      retry: 1, // 실패시 1번만 재시도
    },
  },
})
