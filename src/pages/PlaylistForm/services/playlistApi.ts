import { createClient } from '@supabase/supabase-js'
import {
  CreatePlaylistParams,
  UpdateThumbnailUrlParams,
  UploadThumbnailParams,
  Video,
} from '../model/types/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export const playlistService = {
  // 플레이리스트 생성
  async createPlaylist({
    title,
    description = null,
    profile_id,
    thumbnail_url = null,
    is_public = true,
    hashtag = null,
  }: CreatePlaylistParams) {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        title,
        description,
        profile_id,
        thumbnail_url,
        is_public,
        hashtag,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`플레이리스트 생성 실패: ${error.message}`)
    }

    return data
  },

  // 플레이리스트 아이템 생성
  async createPlaylistItems(playlistId: string, videos: Video[]) {
    const playlistItems = videos.map((video, index) => ({
      playlist_id: playlistId,
      video_id: video.id,
      title: video.title,
      thumbnail_url: video.thumbnailUrl,
      sort_order: index, // 영상 순서 저장
    }))

    const { error } = await supabase.from('playlist_items').insert(playlistItems)

    if (error) {
      throw new Error(`플레이리스트 아이템 생성 실패: ${error.message}`)
    }
  },

  // 플레이리스트 조회
  async getPlaylist(playlistId: string) {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single()

    if (error) {
      throw new Error(`플레이리스트 조회 실패: ${error.message}`)
    }

    return data
  },

  // 썸네일 업로드
  async uploadThumbnail({ file, userId, playlistId }: UploadThumbnailParams) {
    // 파일의 실제 확장자 추출
    const extension = file.name.split('.').pop() || 'jpg'
    // userId 폴더 안에 playlistId를 파일명으로 사용
    const filePath = `${userId}/${playlistId}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('images/playlist')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) {
      throw new Error('썸네일 업로드 실패')
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images/playlist').getPublicUrl(filePath)

    if (!publicUrl) {
      throw new Error('썸네일 URL 가져오기 실패')
    }

    return publicUrl
  },

  // 썸네일 URL 업데이트
  async updateThumbnailUrl({ playlistId, thumbnailUrl }: UpdateThumbnailUrlParams) {
    const { error } = await supabase
      .from('playlists')
      .update({
        thumbnail_url: thumbnailUrl,
      })
      .eq('id', playlistId)

    if (error) {
      throw new Error(`썸네일 URL 업데이트 실패: ${error.message}`)
    }
  },
}
