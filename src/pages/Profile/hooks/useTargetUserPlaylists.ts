import { PlaylistWithItems } from '@/pages/Home/model/types'
import { supabase } from '@/shared/model/api/supabase'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useTargetUserPlaylists = (targetProfileId?: string) => {
  return useSuspenseQuery<PlaylistWithItems[]>({
    queryKey: ['playlists_with_items', targetProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(*)')
        .eq('profile_id', targetProfileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      if (error || !data) throw new Error('user not found')
      return data
    },
    refetchOnWindowFocus: false,
  })
}
