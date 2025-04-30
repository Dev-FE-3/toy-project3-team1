import { profileSharedService } from '@/shared/services/profileSharedService'
import { useSuspenseQuery } from '@tanstack/react-query'
import { profileSharedQueryKeys } from './profileSharedQueryKeys'

export function useProfileSharedQuery(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: profileSharedQueryKeys.image(userId),
    queryFn: async () => {
      const { data } = await profileSharedService.getProfileRow(userId)
      if (!data?.profile_image_url) return null
      const { publicUrl } = await profileSharedService.getProfileImageUrl(data.profile_image_url)
      return publicUrl
    },
  })
}
