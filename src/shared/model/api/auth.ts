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

    // 로그인 성공 후 프로필 동기화
    if (data.user) {
      await syncUserProfile(data.user.id)
    }

    return data
  } catch (error) {
    console.error('로그인 프로세스 오류:', error)
    throw error
  }
}

type SignupFormValues = {
  email: string
  password: string
  nickname: string
}

// 회원가입(email)
export const signUpWithEmail = async ({ email, password, nickname }: SignupFormValues) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
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
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('로그아웃 중 오류 발생:', error)
      throw error
    }
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
  const storedSession = localStorage.getItem('supabase_auth_token')

  if (!storedSession) {
    console.error('저장된 세션 없음')
    return null
  }

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
  if (data.session) {
    // 세션이 있으면 토큰 갱신
    const { error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('세션 갱신 오류:', error)
    } else {
    }
  }
}

// 닉네임 중복 체크
export const checkNicknameExists = async (nickname: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('nickname', nickname)
  if (error) {
    throw error
  }
  return data.length > 0
}

// 이메일 중복 체크
export const checkEmailExists = async (email: string) => {
  const { data, error } = await supabase.from('profiles').select('email').eq('email', email)
  if (error) {
    throw error
  }

  return data.length > 0
}

// 닉네임 업데이트
export const updateNickname = async (userId: string, newNickname: string) => {
  try {
    // profiles 테이블 업데이트
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ nickname: newNickname, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (profileError) {
      console.error('프로필 닉네임 업데이트 실패:', profileError)
      throw profileError
    }

    // Auth 메타데이터 업데이트
    const { error: authError } = await supabase.auth.updateUser({
      data: { nickname: newNickname },
    })

    if (authError) {
      console.error('Auth 메타데이터 닉네임 업데이트 실패:', authError)
      throw authError
    }

    return true
  } catch (error) {
    console.error('닉네임 업데이트 중 오류 발생:', error)
    throw error
  }
}

// 사용자 프로필 동기화
export const syncUserProfile = async (userId: string) => {
  try {
    // profiles 테이블에서 최신 데이터 가져오기
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('프로필 정보 가져오기 실패:', profileError)
      throw profileError
    }

    // Auth 메타데이터 업데이트
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        nickname: profileData.nickname,
        updated_at: profileData.updated_at,
      },
    })

    if (authError) {
      console.error('Auth 메타데이터 업데이트 실패:', authError)
      throw authError
    }

    return true
  } catch (error) {
    console.error('프로필 동기화 중 오류 발생:', error)
    throw error
  }
}
