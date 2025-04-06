import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/shared/model/api/supabase'
import { Profile } from '@/shared/types/profile'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  profile: Profile | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  signIn: async () => {},
  signOut: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log(' checkAuth ~ session: ', session)

        if (session) {
          setIsAuthenticated(true)

          // 사용자 프로필 정보 가져오기
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('프로필 정보 가져오기 실패:', error)
          } else {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // 인증 상태 변경 이벤트 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setIsAuthenticated(!!session)
        console.log('authListener ~ session: ', session)

        if (session) {
          // 사용자 프로필 정보 가져오기
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          console.log(' data: ', profileData)
          if (error) {
            console.error('프로필 정보 가져오기 실패:', error)
          } else {
            setProfile(profileData)
          }
        } else {
          setProfile(null)
        }

        setIsLoading(false)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // 로그인 함수
  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('로그인 중 오류:', error)
    }
  }

  // 로그아웃 함수
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      setIsAuthenticated(false)
      setProfile(null)
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    profile,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
