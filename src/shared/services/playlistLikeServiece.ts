import { supabase } from '../model/api/supabase'
export const playlistLikeService = {
  async fetchedUserLikes(profileId: string, playlistId: string | undefined) {
    const { data: isLikedData, error } = await supabase
      .from('playlists_likes')
      .select('id')
      .eq('user_id', profileId)
      .eq('playlist_id', playlistId)
      .maybeSingle()
    if (error) throw new Error('플레이리스트 좋아요 수를 로드하는 데 실패했습니다.')
    return isLikedData
  },

  async fetchedPlaylistLikes(playlistId: string | undefined) {
    const { count, error } = await supabase
      .from('playlists_likes')
      .select('id', { count: 'exact' })
      .eq('playlist_id', playlistId)

    if (error) throw new Error('플레이리스트 좋아요 수를 로드하는 데 실패했습니다.')
    return count
  },

  async updatePlaylistLike(profileId: string | undefined, playlistId: string | undefined) {
    await supabase.from('playlists_likes').insert({
      user_id: profileId,
      playlist_id: playlistId,
    })
  },

  async deletePlaylistLike(profileId: string | undefined, playlistId: string | undefined) {
    await supabase
      .from('playlists_likes')
      .delete()
      .eq('user_id', profileId)
      .eq('playlist_id', playlistId)
  },
}
