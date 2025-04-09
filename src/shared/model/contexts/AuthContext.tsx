// src/shared/model/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { getSession } from '@/shared/model/api/auth'
import { User } from '@supabase/supabase-js'
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

  useEffect(() => {
    // 인증 상태 확인
    const checkAuth = async () => {
      try {
        const session = await getSession()
        setState({
          isAuthenticated: !!session,
          isLoading: false,
          profile: session?.user || null,
        })
      } catch (error) {
        console.error('인증 확인 중 오류:', error)
        setState({
          isAuthenticated: false,
          isLoading: false,
          profile: null,
        })
      }
    }

    checkAuth()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
