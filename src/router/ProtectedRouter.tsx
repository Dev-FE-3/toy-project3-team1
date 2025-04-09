import { useLocation, Navigate } from 'react-router-dom'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation() // 요청받은 경로 (로그인 성공 후 해당 페이지로 이동 할 수 있음)
  const { isAuthenticated } = useGetAuthState()
  const fromTo = location.state?.from || '/'

  if (isAuthenticated) {
    return <Navigate to={fromTo} replace />
  }

  return children
}
