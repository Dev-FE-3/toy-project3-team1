import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 클라이언트 초기화 상태 추적
let isInitialized = false
const clientId = Math.random().toString(36).substring(2, 10)

// Supabase 인스턴스
let supabaseInstance: SupabaseClient | null = null

// 클라이언트 생성 함수
const createSupabaseClient = (): SupabaseClient => {
  // 항상 새 클라이언트 생성
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'supabase_auth_token',
    },
  })

  return client
}

// 클라이언트 초기화 함수
export const initializeSupabase = (): SupabaseClient => {
  if (!isInitialized || !supabaseInstance) {
    supabaseInstance = createSupabaseClient()
    isInitialized = true

    // 세션 상태 변경 리스너 추가
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log(`[${clientId}] 인증 상태 변경 감지:`, event, !!session)
    })
  }

  return supabaseInstance
}

// 강제로 클라이언트 재생성
export const forceReinitSupabase = (): SupabaseClient => {
  console.log('Supabase 클라이언트 강제 재초기화')

  // 기존 리스너 정리
  if (supabaseInstance) {
    try {
      // 필요한 정리 작업 수행
      console.log(`[${clientId}] 기존 Supabase 클라이언트 정리`)
    } catch (e) {
      console.error('클라이언트 정리 중 오류:', e)
    }
  }

  isInitialized = false
  supabaseInstance = createSupabaseClient()
  isInitialized = true

  return supabaseInstance
}

// 기본 인스턴스 초기화 및 export
export const supabase = initializeSupabase()

// 세션 초기화 함수 - 로컬 스토리지 토큰 검사 및 유효성 검증
export const validateSession = async (): Promise<boolean> => {
  try {
    console.log(`[${clientId}] 세션 유효성 검사 시작`)

    // 로컬 스토리지에서 토큰 확인
    const rawToken = localStorage.getItem('supabase_auth_token')
    if (!rawToken) {
      console.log('로컬 스토리지에 토큰 없음')
      return false
    }

    // 토큰 데이터 파싱 시도
    try {
      const tokenData = JSON.parse(rawToken)
      if (!tokenData) {
        console.log('저장된 토큰 데이터가 없음')
        return false
      }

      // 실제 세션 가져오기 시도
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('세션 가져오기 오류:', error.message)
        await clearAuthData()
        return false
      }

      if (!data.session) {
        console.log('유효한 세션 없음, 저장된 토큰 제거')
        await clearAuthData()
        return false
      }

      // 토큰 만료 확인
      const expiresAt = data.session.expires_at
      if (expiresAt) {
        const now = Math.floor(Date.now() / 1000)
        if (expiresAt <= now) {
          console.log('토큰 만료됨, 세션 정리')
          await clearAuthData()
          return false
        }
      }

      console.log('유효한 세션 확인됨')
      return true
    } catch (parseError) {
      console.error('토큰 데이터 파싱 오류:', parseError)
      await clearAuthData()
      return false
    }
  } catch (e) {
    console.error('세션 유효성 검사 중 예외 발생:', e)
    await clearAuthData()
    return false
  }
}

// 인증 데이터 완전히 정리
export const clearAuthData = async (): Promise<void> => {
  try {
    console.log(`[${clientId}] 인증 데이터 정리 중...`)

    // 로컬 스토리지 토큰 제거
    localStorage.removeItem('supabase_auth_token')
    localStorage.removeItem('supabase_auth_token_v2')

    // 세션 스토리지 정리
    sessionStorage.removeItem('supabase_auth_token')
    sessionStorage.removeItem('supabase_auth_token_v2')

    // 쿠키 정리 (필요한 경우)
    document.cookie = 'supabase-auth-token=; Max-Age=0; path=/; domain=' + window.location.hostname

    // Supabase 로그아웃
    try {
      await supabase.auth.signOut({ scope: 'global' })
      console.log('Supabase 로그아웃 완료')
    } catch (signOutError) {
      console.error('로그아웃 처리 중 오류:', signOutError)
    }

    // 클라이언트 재초기화 - 완전히 새로운 인스턴스 생성
    forceReinitSupabase()

    console.log('인증 데이터 정리 완료')
  } catch (e) {
    console.error('인증 데이터 정리 중 오류:', e)
    // 심각한 오류 시 페이지 새로고침 고려
    // window.location.reload()
  }
}

// 인증 토큰 디버깅 함수
export const debugAuthToken = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession()

    if (data.session) {
      const token = data.session.access_token
      console.log(`[${clientId}] 현재 액세스 토큰 접두사:`, token.substring(0, 10) + '...')
      console.log('토큰 만료 시간:', new Date(data.session.expires_at! * 1000).toLocaleString())

      // 토큰 상태 점검
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const expiresAtSeconds = data.session.expires_at || 0

      if (expiresAtSeconds) {
        const timeLeftSeconds = expiresAtSeconds - nowInSeconds
        console.log(`토큰 남은 시간: ${timeLeftSeconds}초 (${Math.floor(timeLeftSeconds / 60)}분)`)

        if (timeLeftSeconds < 60) {
          console.log('⚠️ 토큰 만료가 임박했습니다!')
        }

        if (timeLeftSeconds <= 0) {
          console.log('⚠️ 토큰이 이미 만료되었습니다. 세션 정리 필요')
          await clearAuthData()
          return false
        }
      }

      return true
    }

    console.log('인증 세션 없음')
    return false
  } catch (e) {
    console.error('토큰 디버깅 중 오류:', e)
    return false
  }
}

// 세션 재설정 함수
export const resetSession = async (): Promise<void> => {
  try {
    console.log(`[${clientId}] 세션 재설정 시작`)
    await clearAuthData()
    console.log('세션 재설정 완료')
  } catch (error) {
    console.error('세션 재설정 중 예외 발생:', error)
    // 심각한 오류 시 페이지 새로고침
    // window.location.reload()
  }
}

// initializeSession은 validateSession으로 대체
export const initializeSession = validateSession
// cleanupSession은 clearAuthData로 대체
export const cleanupSession = clearAuthData
