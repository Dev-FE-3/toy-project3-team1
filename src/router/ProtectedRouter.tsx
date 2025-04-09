import { useLocation, Navigate } from 'react-router-dom'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'

// 로그인한 사용자만 접근 가능한 라우트
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isAuthenticated } = useGetAuthState()

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

// 로그인하지 않은 사용자만 접근 가능한 라우트 (로그인, 회원가입 페이지 등)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isAuthenticated } = useGetAuthState()
  const fromTo = location.state?.from || '/'

  if (isAuthenticated) {
    // 이미 로그인된 경우 홈 또는 이전 페이지로 리다이렉트
    return <Navigate to={fromTo} replace />
  }

  return children
}
