import { Playlist } from '@/pages/Home/model/types'
import { supabase } from '@/shared/model/api/supabase'
import { useQuery } from '@tanstack/react-query'

export const useTargetUserPlaylists = (targetProfileId?: string) => {
  return useQuery<Playlist[]>({
    queryKey: ['playlists_with_items', targetProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(*)')
        .eq('profile_id', targetProfileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw new Error('Error fetching playlists with items')

      return data ?? []
    },
    enabled: !!targetProfileId,
    refetchOnWindowFocus: false,
  })
}
