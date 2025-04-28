import { supabase } from '../model/api/supabase'

export const playlistBookmarkService = {
  async fetchedUserBookmark(profileId: string, playlistId: string | undefined) {
    const { data: isBookmarkedData } = await supabase
      .from('playlists_subscribers')
      .select('id')
      .eq('user_id', profileId)
      .eq('playlist_id', playlistId)
      .maybeSingle()

    return isBookmarkedData
  },

  async fetchedPlaylistBookmarks(playlistId: string | undefined) {
    const { count } = await supabase
      .from('playlists_subscribers')
      .select('id', { count: 'exact' })
      .eq('playlist_id', playlistId)

    return count
  },

  async updatePlaylistBookmark(profileId: string | undefined, playlistId: string | undefined) {
    await supabase.from('playlists_subscribers').insert({
      user_id: profileId,
      playlist_id: playlistId,
    })
  },

  async deletePlaylistBookmark(profileId: string | undefined, playlistId: string | undefined) {
    await supabase
      .from('playlists_subscribers')
      .delete()
      .eq('user_id', profileId)
      .eq('playlist_id', playlistId)
  },
}
