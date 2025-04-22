import { supabase } from '@/shared/model/api/supabase'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useTargetUserProfileInfo = (targetProfileId?: string) => {
  return useSuspenseQuery({
    queryKey: ['profile', targetProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .maybeSingle()
      if (error) throw new Error('Error fetching target user profile info')
      return data
    },
    refetchOnWindowFocus: false,
  })
}
