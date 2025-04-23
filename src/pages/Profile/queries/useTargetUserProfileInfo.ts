import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchTargetUserProfileInfo } from '../services/playlistWithItemsService'
import { profilePageQueryKeys } from './profilePageQueryKeys'

export const useTargetUserProfileInfo = (targetProfileId?: string) => {
  return useSuspenseQuery({
    queryKey: profilePageQueryKeys.profile(targetProfileId),
    queryFn: async () => {
      return await fetchTargetUserProfileInfo(targetProfileId)
    },
    refetchOnWindowFocus: false,
  })
}
