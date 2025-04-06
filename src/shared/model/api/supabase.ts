import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('환경 변수가 정의되지 않았습니다. Supabase URL과 Anon Key를 확인하세요.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
