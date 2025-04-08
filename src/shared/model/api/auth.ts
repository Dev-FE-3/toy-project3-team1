import { supabase } from './supabase'

// 이메일 로그인 함수
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('로그인 중 오류 발생:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('로그인 프로세스 오류:', error)
    throw error
  }
}

// 이메일 회원가입 함수
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('회원가입 중 오류 발생:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('회원가입 프로세스 오류:', error)
    throw error
  }
}

// 비밀번호 재설정 이메일 보내기
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('비밀번호 재설정 이메일 전송 중 오류 발생:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('비밀번호 재설정 프로세스 오류:', error)
    throw error
  }
}

// 로그아웃 함수
export const signOut = async () => {
  try {
    console.log('signOut 호출')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('로그아웃 중 오류 발생:', error)
      throw error
    }
    console.log('signOut success')
    return true
  } catch (error) {
    console.error('로그아웃 프로세스 오류:', error)
    return false
  }
}

// 현재 로그인된 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return data.user
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error)
    return null
  }
}

// 사용자 세션 정보 가져오기
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    return data.session
  } catch (error) {
    console.error('세션 정보 가져오기 오류:', error)
    return null
  }
}

// 클라이언트 재설정 함수
export const refreshSupabaseClient = async () => {
  // 현재 세션 가져오기
  const { data } = await supabase.auth.getSession()
  // console.log('refreshSupabaseClient 호출', data)
  if (data.session) {
    // 세션이 있으면 토큰 갱신
    const { error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('세션 갱신 오류:', error)
    } else {
      console.log('Supabase 클라이언트 세션 갱신됨')
    }
  }
}
