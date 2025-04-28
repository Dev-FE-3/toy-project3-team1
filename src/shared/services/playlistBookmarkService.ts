import { supabase } from '../model/api/supabase'

export const fetchedUserBookmarks = async (profileId: string, playlistId: string | undefined) => {
  const { data: isBookmarkedData } = await supabase
    .from('playlists_subscribers')
    .select('id')
    .eq('user_id', profileId)
    .eq('playlist_id', playlistId)
    .maybeSingle()

  return isBookmarkedData
}

export const fetchedPlaylistBookmarks = async (playlistId: string | undefined) => {
  const { count } = await supabase
    .from('playlists_subscribers')
    .select('id', { count: 'exact' })
    .eq('playlist_id', playlistId)

  return count
}

export const updatePlaylistBookmark = async (
  profileId: string | undefined,
  playlistId: string | undefined,
) => {
  await supabase.from('playlists_subscribers').insert({
    user_id: profileId,
    playlist_id: playlistId,
  })
}

export const deletePlaylistBookmark = async (
  profileId: string | undefined,
  playlistId: string | undefined,
) => {
  await supabase
    .from('playlists_subscribers')
    .delete()
    .eq('user_id', profileId)
    .eq('playlist_id', playlistId)
}
