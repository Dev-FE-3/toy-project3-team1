// shared/services/nicknameService.ts
import { supabase } from '@/shared/model/api/supabase'

export const checkNicknameDuplicate = async (nickname: string, profileId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .neq('id', profileId)

  if (error) throw new Error(error.message)

  return data.length === 0 // 사용 가능하면 true
}
