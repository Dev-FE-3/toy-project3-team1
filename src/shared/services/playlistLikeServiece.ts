import { supabase } from '../model/api/supabase'

export const fetchedUserLikes = async (profileId: string, playlistId: string | undefined) => {
  const { data: isLikedData } = await supabase
    .from('playlists_likes')
    .select('id')
    .eq('user_id', profileId)
    .eq('playlist_id', playlistId)
    .maybeSingle()

  return isLikedData
}

export const fetchedPlaylistLikes = async (playlistId: string | undefined) => {
  const { count } = await supabase
    .from('playlists_likes')
    .select('id', { count: 'exact' })
    .eq('playlist_id', playlistId)

  console.log(count)
  return count
}

export const updatePlaylistLike = async (
  profileId: string | undefined,
  playlistId: string | undefined,
) => {
  await supabase.from('playlists_likes').insert({
    user_id: profileId,
    playlist_id: playlistId,
  })
}

export const deletePlaylistLike = async (
  profileId: string | undefined,
  playlistId: string | undefined,
) => {
  await supabase
    .from('playlists_likes')
    .delete()
    .eq('user_id', profileId)
    .eq('playlist_id', playlistId)
}

