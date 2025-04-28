import { useMutation } from '@tanstack/react-query'
import { updateNickname } from '@/shared/model/api/auth'
import { queryClient } from '@/shared/model/lib/queryClient'
import { profilePageQueryKeys } from './profilePageQueryKeys'

export const useUpdateNickname = () => {
  return useMutation({
    mutationFn: ({ profileId, nickname }: { profileId: string; nickname: string }) =>
      updateNickname(profileId, nickname),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: profilePageQueryKeys.profile(variables.profileId) })
    },
  })
}
