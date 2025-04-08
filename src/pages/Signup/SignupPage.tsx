import { useAuthContext } from '@/shared/model/contexts/AuthContext'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const { isAuthenticated, isLoading } = useAuthContext()
  const navigate = useNavigate()

  // 로그인 상태 확인 후 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('이미 로그인 상태입니다. 홈으로 리다이렉트합니다.')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  // 로그인 상태면 홈으로 즉시 리다이렉트
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />
  }

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-c900 flex min-h-screen items-center justify-center">
        <p className="text-c50">로딩 중...</p>
      </div>
    )
  }

  return <div>SignupPage</div>
}

export default SignupPage
