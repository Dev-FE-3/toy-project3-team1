import { supabase } from '@/shared/model/api/supabase'

export const fetchPlaylistWithItems = async (targetProfileId: string | undefined) => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*, playlist_items(*)')
    .eq('profile_id', targetProfileId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  if (error || !data) throw new Error('user not found')
  return data
}

export const fetchTargetUserProfileInfo = async (targetProfileId: string | undefined) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetProfileId)
    .maybeSingle()
  if (error) throw new Error('Error fetching target user profile info')
  return data
}
