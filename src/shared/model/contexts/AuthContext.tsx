// src/shared/model/contexts/AuthContext.tsx
import { getSession } from '@/shared/model/api/auth'
import { supabase } from '@/shared/model/api/supabase'
import { useUserStore } from '@/shared/store/userStore'
import { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  profile: User | null
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  profile: null,
})

export const useGetAuthState = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    profile: null,
  })
  const setProfileId = useUserStore((state) => state.setProfileId)
  const clearProfile = useUserStore((state) => state.clearProfile)

  useEffect(() => {
    // 초기 인증 상태 확인
    const checkAuth = async () => {
      try {
        const session = await getSession()
        setState({
          isAuthenticated: !!session,
          isLoading: false,
          profile: session?.user || null,
        })
        // userStore 업데이트
        if (session?.user?.id) {
          setProfileId(session.user.id)
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error)
        setState({
          isAuthenticated: false,
          isLoading: false,
          profile: null,
        })
        clearProfile() // 에러 시 프로필 ID 초기화
      }
    }

    // 인증 상태 변경 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      setState({
        isAuthenticated: !!session,
        isLoading: false,
        profile: session?.user || null,
      })
      // userStore 업데이트
      if (session?.user?.id) {
        setProfileId(session.user.id)
      } else {
        clearProfile() // 로그아웃 시 프로필 ID 초기화
      }
    })

    // 초기 인증 상태 확인 실행
    checkAuth()

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      subscription.unsubscribe()
    }
  }, [setProfileId, clearProfile])

  // 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 표시
  if (state.isLoading) {
    return null // 또는 <LoadingSpinner />
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
