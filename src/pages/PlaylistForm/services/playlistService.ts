import { supabase } from '@/shared/model/api/supabase'

import {
  CreatePlaylistParams,
  PlaylistItem,
  UpdatePlaylistParams,
  Video,
} from '@/pages/PlaylistForm/model/types/types'

export const playlistService = {
  // === 플레이리스트 생성 ===
  async createPlaylist(params: CreatePlaylistParams) {
    try {
      const { data, error } = await supabase.from('playlists').insert(params).select().single()
      if (error) {
        console.error('Create playlist error:', error)
        throw error
      }
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`플레이리스트 생성 실패: ${error.message}`)
      }
      throw new Error('플레이리스트 생성 중 알 수 없는 오류가 발생했습니다.')
    }
  },

  // === 플레이리스트 조회 ===
  async getPlaylist(playlistId: string) {
    try {
      // 1. 플레이리스트 기본 정보 조회
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single()

      if (playlistError) throw playlistError

      // 2. 플레이리스트 아이템 조회
      const { data: playlistItems, error: itemsError } = await supabase
        .from('playlist_items')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('sort_order')

      if (itemsError) throw itemsError

      // 3. 결과 합치기
      return {
        ...playlist,
        playlist_items: playlistItems || [],
      }
    } catch (error) {
      console.error('Get playlist error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('플레이리스트 조회 중 오류가 발생했습니다.')
    }
  },

  // === 플레이리스트 수정 ===
  async updatePlaylist(playlistId: string, params: UpdatePlaylistParams) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .update({
          title: params.title,
          description: params.description,
          hashtag: params.hashtag,
          is_public: params.is_public,
        })
        .eq('id', playlistId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update playlist error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('플레이리스트 수정 중 오류가 발생했습니다.')
    }
  },

  // === 플레이리스트 아이템 생성 ===
  async createPlaylistItems(playlistId: string, videos: Video[]) {
    try {
      const items = videos.map((video, index) => ({
        video_id: video.id,
        title: video.title,
        thumbnail_url: video.thumbnailUrl,
        sort_order: index,
        playlist_id: playlistId,
      }))

      const { error } = await supabase.from('playlist_items').insert(items)
      if (error) {
        console.error('Create playlist items error:', error)
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('플레이리스트 아이템 생성 중 알 수 없는 오류가 발생했습니다.')
    }
  },

  // === 플레이리스트 아이템 수정 ===
  async updatePlaylistItems(playlistId: string, items: PlaylistItem[]) {
    try {
      // 1. 기존 아이템 삭제
      const { error: deleteError } = await supabase
        .from('playlist_items')
        .delete()
        .eq('playlist_id', playlistId)

      if (deleteError) throw deleteError

      // 2. 새로운 아이템 추가
      const { error: insertError } = await supabase.from('playlist_items').insert(items)

      if (insertError) throw insertError
    } catch (error) {
      console.error('Update playlist items error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('플레이리스트 아이템 수정 중 오류가 발생했습니다.')
    }
  },

  // === 썸네일 관리 ===
  async uploadThumbnail(file: File, userId: string, playlistId: string) {
    try {
      // 1. 기존 파일 찾기 및 삭제
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('images')
        .list(`playlist/${userId}`)

      if (listError) throw listError

      if (existingFiles && existingFiles.length > 0) {
        const targetFile = existingFiles.find((file) => file.name === playlistId)
        if (targetFile) {
          const fileToDelete = `playlist/${userId}/${playlistId}`
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([fileToDelete])

          if (deleteError) throw deleteError
        }
      }
      const res = await supabase.storage
        .from('images')
        .upload('test.txt', new Blob(['hello']), { upsert: true })
      console.log(res)
      // 2. 새 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(`playlist/${userId}/${playlistId}`, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // 3. 업로드된 파일의 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(`playlist/${userId}/${playlistId}`)

      // publicUrl에 캐시 무효화 쿼리 파라미터 추가
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`

      // 4. 플레이리스트 썸네일 URL 업데이트
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ thumbnail_url: cacheBustedUrl })
        .eq('id', playlistId)

      if (updateError) throw updateError

      return cacheBustedUrl
    } catch {
      throw new Error('썸네일 업로드 중 오류가 발생했습니다.')
    }
  },

  // 썸네일 삭제
  async deleteThumbnail(userId: string, playlistId: string) {
    try {
      // 기존 파일 찾기
      const { data: files } = await supabase.storage.from('images/playlist').list(userId, {
        search: playlistId,
      })

      // 기존 파일이 있다면 삭제
      if (files && files.length > 0) {
        const filesToDelete = files.map((file) => `${userId}/${file.name}`)
        const { error } = await supabase.storage.from('images/playlist').remove(filesToDelete)
        if (error) throw error
      }
    } catch (error) {
      console.error('Delete thumbnail error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('썸네일 삭제 중 오류가 발생했습니다.')
    }
  },

  // 썸네일 URL 업데이트
  async updateThumbnailUrl(playlistId: string, thumbnailUrl: string | null) {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', playlistId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating thumbnail URL:', error)
      throw new Error('썸네일 URL 업데이트 중 오류가 발생했습니다.')
    }
  },

  // 썸네일 파일 삭제
  async deleteThumbnailFile(userId: string, playlistId: string) {
    try {
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('images')
        .list(`playlist/${userId}`)

      if (listError) throw listError

      if (existingFiles && existingFiles.length > 0) {
        const targetFile = existingFiles.find((file) => file.name === playlistId)
        if (targetFile) {
          const fileToDelete = `playlist/${userId}/${playlistId}`
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([fileToDelete])

          if (deleteError) throw deleteError
        }
      }
    } catch {
      throw new Error('썸네일 파일 삭제 중 오류가 발생했습니다.')
    }
  },

  // 썸네일 제거 (파일 삭제 + URL 초기화)
  async removeThumbnail(userId: string, playlistId: string) {
    try {
      // 1. Storage의 파일 삭제
      await this.deleteThumbnailFile(userId, playlistId)

      // 2. 플레이리스트의 썸네일 URL 초기화
      await this.updateThumbnailUrl(playlistId, null)
    } catch {
      throw new Error('썸네일 제거 중 오류가 발생했습니다.')
    }
  },

  // 썸네일 초기화 (첫 번째 비디오 썸네일로 설정)
  async resetThumbnail(playlistId: string, userId: string) {
    try {
      // 1. 기존 썸네일 파일 삭제
      await this.deleteThumbnail(userId, playlistId)

      // 2. 첫 번째 비디오의 썸네일 URL 가져오기
      const { data: items, error: itemsError } = await supabase
        .from('playlist_items')
        .select('thumbnail_url')
        .eq('playlist_id', playlistId)
        .order('sort_order')
        .limit(1)

      if (itemsError) throw itemsError

      const thumbnailUrl = items?.[0]?.thumbnail_url || null

      // 3. 플레이리스트 썸네일 URL 업데이트
      await this.updateThumbnailUrl(playlistId, thumbnailUrl)

      return thumbnailUrl
    } catch (error) {
      console.error('Reset thumbnail error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('썸네일 초기화 중 오류가 발생했습니다.')
    }
  },

  async updatePlaylistThumbnail(file: File, userId: string, playlistId: string) {
    try {
      // 1. 썸네일 파일 업로드 (기존 파일 삭제 포함)
      const thumbnailUrl = await this.uploadThumbnail(file, userId, playlistId)

      // 2. 플레이리스트 썸네일 URL 업데이트
      const { error } = await supabase
        .from('playlists')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', playlistId)

      if (error) throw error

      return thumbnailUrl
    } catch (error) {
      console.error('Error updating playlist thumbnail:', error)
      throw error
    }
  },

  // 파일이 있으면 업로드, 없으면 삭제만 수행
  async uploadOrDeleteThumbnail(file: File | null, userId: string, playlistId: string) {
    if (file) {
      return this.uploadThumbnail(file, userId, playlistId)
    } else {
      await this.deleteThumbnailFile(userId, playlistId)
      return null
    }
  },
}
