import { supabase } from '@/shared/model/api/supabase'
import type { Category, Playlist, VideoItem } from '@/pages/Home/model/types'

export const fetchPlaylists = async (
  pageParam: number,
  pageSize: number,
  userId?: string,
  category?: Category,
) => {
  const offset = pageParam

  let query = supabase
    .from('playlists')
    .select(
      `
      *,
      profiles:profile_id (nickname),
      playlist_items (*)
      `,
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset * pageSize, offset * pageSize + (pageSize - 1))

  if (userId) {
    query = query.neq('profile_id', userId)
  }

  if (category && category !== '전체') {
    query = query.or(`hashtag.cs.{${category}}`)
  } else if (category === '전체') {
    query = query.or(`hashtag.is.null,hashtag.cs.{}`)
  }

  const { data, error } = await query

  if (error || !data) throw new Error(error.message || 'Unknown error')

  return {
    playlists: data as Playlist[],
    videoItems: data.flatMap((playlist) => playlist.playlist_items as VideoItem[]),
  }
}

export const playlistService = {
  fetchPlaylists,
}
