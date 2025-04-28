import { Profile } from '@/pages/Profile/model/type'
import { supabase } from '@/shared/model/api/supabase'
import { checkSupabaseError } from '@/shared/model/utils/checkSupabaseError'

export const profileSharedService = {
  // profile row 조회 (profileId로)
  async getProfileRow(profileId: string): Promise<{ data: Profile }> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single()
    return { data: checkSupabaseError(data, error, 'getProfileRow') }
  },

  // filePath 전체를 받아 publicUrl 반환
  async getProfileImageUrl(filePath: string): Promise<{ publicUrl: string }> {
    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    const publicUrl = data?.publicUrl
    if (!publicUrl) {
      throw new Error('이미지 URL이 없습니다.')
    }
    return { publicUrl }
  },
}
