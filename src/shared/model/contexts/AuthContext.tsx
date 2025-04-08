import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  supabase,
  debugAuthToken,
  validateSession,
  clearAuthData,
  forceReinitSupabase,
} from '@/shared/model/api/supabase'
import { Profile } from '@/shared/types/profile'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  profile: Profile | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshAuth: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export const useAuthContext = () => useContext(AuthContext)

// 가드 훅: 로그인 상태에서 특정 페이지 접근 시 리다이렉트를 위한 커스텀 훅
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthContext()
  return { isAuthenticated, isLoading }
}

// 오류 카운터
let errorCounter = 0
const MAX_ERRORS = 3

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  // 강제로 인증 상태 새로고침
  const refreshAuth = async () => {
    try {
      console.log('===== 인증 상태 강제 새로고침 =====')
      setIsLoading(true)

      // 세션 검증
      const isValid = await validateSession()
      console.log('세션 유효성 검사 결과:', isValid)

      if (!isValid) {
        // 세션이 유효하지 않으면 인증 상태 초기화
        setIsAuthenticated(false)
        setProfile(null)
        setIsLoading(false)
        return
      }

      // 세션이 유효하면 사용자 정보 가져오기
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsAuthenticated(true)
        await fetchProfileData(data.session.user.id)
      } else {
        setIsAuthenticated(false)
        setProfile(null)
      }
    } catch (error) {
      console.error('인증 상태 새로고침 중 오류:', error)
      setIsAuthenticated(false)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('===== AuthContext: 인증 상태 확인 =====')

        // 클라이언트 초기화 확인 및 세션 검증
        const isValid = await validateSession()
        console.log('세션 유효성 검사 결과:', isValid)

        if (!isValid) {
          console.log('유효한 세션이 없음')
          setIsAuthenticated(false)
          setProfile(null)
          setIsLoading(false)
          return
        }

        // 세션 가져오기
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('세션 가져오기 실패:', error)
          await clearAuthData()
          setIsAuthenticated(false)
          setProfile(null)
          setIsLoading(false)
          return
        }

        if (data.session) {
          console.log('유효한 세션 발견')

          // 토큰 디버깅
          await debugAuthToken()

          // 세션 설정
          setIsAuthenticated(true)

          // 프로필 정보 가져오기
          await fetchProfileData(data.session.user.id)
        } else {
          console.log('세션 없음')
          setIsAuthenticated(false)
          setProfile(null)
        }
      } catch (error) {
        console.error('인증 확인 중 예외 발생:', error)
        errorCounter++

        if (errorCounter >= MAX_ERRORS) {
          console.error(`연속 ${MAX_ERRORS}회 오류 발생, 세션 강제 초기화 수행`)
          await clearAuthData()

          // 페이지 새로고침 고려
          // window.location.reload()
        }

        setIsAuthenticated(false)
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // 인증 상태 변경 이벤트 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('===== AuthContext: 인증 상태 변경 감지 =====')
        console.log('AuthContext ~ 이벤트 타입:', event)
        console.log('AuthContext ~ 세션 존재 여부:', !!session)

        try {
          if (event === 'SIGNED_IN' && session) {
            // 로그인 성공
            console.log('로그인 성공 이벤트')
            setIsAuthenticated(true)
            await fetchProfileData(session.user.id)
          } else if (event === 'SIGNED_OUT') {
            // 로그아웃
            console.log('로그아웃 이벤트')
            setIsAuthenticated(false)
            setProfile(null)
          } else if (event === 'TOKEN_REFRESHED' && session) {
            // 토큰 갱신
            console.log('토큰 갱신 이벤트')
            setIsAuthenticated(true)
            await fetchProfileData(session.user.id)
          } else if (session) {
            // 기타 이벤트지만 세션이 존재하는 경우
            console.log('기타 인증 이벤트 (세션 있음):', event)
            setIsAuthenticated(true)
            await fetchProfileData(session.user.id)
          } else {
            // 세션이 없는 경우
            console.log('세션 없는 인증 이벤트:', event)
            setIsAuthenticated(false)
            setProfile(null)
          }
        } catch (error) {
          console.error('인증 상태 변경 처리 중 오류:', error)
          errorCounter++

          if (errorCounter >= MAX_ERRORS) {
            console.error(`연속 ${MAX_ERRORS}회 오류 발생, 강제 초기화 수행`)
            await clearAuthData()
          } else {
            // 세션 유효성 검증
            await validateSession()
          }

          setIsAuthenticated(!!session)
          if (session) {
            try {
              await fetchProfileData(session.user.id)
            } catch (profileError) {
              console.error('프로필 조회 실패:', profileError)
              setProfile(null)
            }
          } else {
            setProfile(null)
          }
        }

        setIsLoading(false)
      },
    )

    return () => {
      try {
        authListener.subscription.unsubscribe()
      } catch (error) {
        console.error('리스너 해제 중 오류:', error)
      }
    }
  }, [])

  // 연속 URL 접근 처리를 위한 페이지 로드 이벤트 감지
  useEffect(() => {
    const onPageShow = async () => {
      console.log('페이지 표시 이벤트 감지 (페이지 간 이동 또는 새로고침)')
      // 인증 상태 강제 리프레시
      await refreshAuth()
    }

    window.addEventListener('pageshow', onPageShow)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  // 프로필 정보 가져오기 함수
  const fetchProfileData = async (userId: string) => {
    try {
      console.log('AuthContext ~ 프로필 정보 조회 시도')
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('AuthContext ~ 프로필 정보 가져오기 실패:', error)
      } else {
        console.log('AuthContext ~ 프로필 정보 조회 성공')
        setProfile(profileData)
      }
    } catch (error) {
      console.error('AuthContext ~ 프로필 조회 중 예외:', error)
    }
  }

  // 로그인 함수
  const signIn = async () => {
    try {
      console.log('===== AuthContext: 로그인 시도 =====')

      // 기존 세션 정리 (충돌 방지)
      await clearAuthData()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('AuthContext ~ 로그인 중 오류:', error)
        throw error
      }
      console.log('AuthContext ~ 로그인 요청 성공 (리디렉션 진행 중)')
    } catch (error) {
      console.error('AuthContext ~ 로그인 프로세스 오류:', error)
      errorCounter++
    }
  }

  // 로그아웃 함수
  const signOut = async () => {
    try {
      console.log('===== AuthContext: 로그아웃 시도 =====')
      setIsLoading(true)

      // 모든 인증 데이터 정리 (클라이언트 재초기화 포함)
      await clearAuthData()

      // 상태 업데이트
      setIsAuthenticated(false)
      setProfile(null)

      // 오류 카운터 초기화
      errorCounter = 0

      console.log('로그아웃 성공')
    } catch (error) {
      console.error('AuthContext ~ 로그아웃 프로세스 오류:', error)

      // 클라이언트 강제 재초기화
      forceReinitSupabase()

      // 상태 초기화
      setIsAuthenticated(false)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    profile,
    signIn,
    signOut,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
