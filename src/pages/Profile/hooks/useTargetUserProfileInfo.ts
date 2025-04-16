import { supabase } from '@/shared/model/api/supabase'
import { useQuery } from '@tanstack/react-query'

export const useTargetUserProfileInfo = (targetProfileId?: string) => {
  return useQuery({
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
    enabled: !!targetProfileId, // null이면 쿼리 안 함
    refetchOnWindowFocus: false,
  })
}
