import { supabase } from '@/shared/model/api/supabase'
import { checkSupabaseError } from '@/shared/model/utils/checkSupabaseError'
import { Profile } from '../model/type'

const PROFILE_IMAGE_BUCKET = 'images'
const PROFILE_IMAGE_FOLDER = 'profile'

export const profileService = {
  async uploadProfileImage(file: File, userId: string): Promise<void> {
    const { error } = await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(`${PROFILE_IMAGE_FOLDER}/${userId}`, file, { upsert: true })
    checkSupabaseError(null, error, 'uploadProfileImage')
  },

  // filePath 전체를 받아 publicUrl 반환
  async getProfileImageUrl(filePath: string): Promise<{ publicUrl: string }> {
    const { data } = supabase.storage.from(PROFILE_IMAGE_BUCKET).getPublicUrl(filePath)
    const publicUrl = data?.publicUrl
    if (!publicUrl) {
      throw new Error('이미지 URL이 없습니다.')
    }
    return { publicUrl }
  },

  // 1. 파일 업로드만 (파일 경로 반환)
  async uploadProfileImageToStorage(file: File, userId: string): Promise<string> {
    const ext = file.name.split('.').pop() || ''
    const filePath = `${PROFILE_IMAGE_FOLDER}/${userId}-${Date.now()}` + (ext ? `.${ext}` : '')
    const { error } = await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(filePath, file, { upsert: true })
    checkSupabaseError(null, error, 'uploadProfileImageToStorage')
    return filePath
  },

  // 3. DB에 publicUrl 저장 (filePath 전체를 저장)
  async updateProfileImageUrlInDB(userId: string, filePath: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_image_url: filePath })
      .eq('id', userId)
    checkSupabaseError(null, error, 'updateProfileImageUrlInDB')
  },

  // profile row 조회 (profileId로)
  async getProfileRow(profileId: string): Promise<{ data: Profile }> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single()
    return { data: checkSupabaseError(data, error, 'getProfileRow') }
  },

  // 기존 프로필 이미지 삭제 (filePath 전체를 받아 삭제)
  async deleteProfileImage(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from(PROFILE_IMAGE_BUCKET).remove([filePath])
    checkSupabaseError(null, error, 'deleteProfileImage')
  },
}
