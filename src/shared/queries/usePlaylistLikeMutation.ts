import { useMutation } from '@tanstack/react-query'
import { deletePlaylistLike, updatePlaylistLike } from '../services/playlistLikeServiece'
import { queryClient } from '../model/lib/queryClient'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'
import { User } from '@supabase/supabase-js'

interface Props {
  likeCount: number
  profile: User | null
  playlistId: string | undefined
}

export const usePlaylistLikeMutation = ({ likeCount, profile, playlistId }: Props) => {
  const { mutate: toggleLike, isPending: likeLoading } = useMutation({
    mutationFn: async (newState: boolean) => {
      if (!profile) return

      if (newState) {
        await updatePlaylistLike(profile.id, playlistId)
      } else {
        await deletePlaylistLike(profile.id, playlistId)
      }
    },
    onMutate: async (newState) => {
      const previousUserLike = queryClient.getQueryData([
        LikeBookmarkQueryKeys.userLike(playlistId),
      ])
      const previousPlaylistLikes = queryClient.getQueryData([
        LikeBookmarkQueryKeys.likeCount(playlistId),
      ])

      const updatedLikeCount = newState ? likeCount + 1 : likeCount - 1

      queryClient.setQueryData(LikeBookmarkQueryKeys.userLike(playlistId), {
        newState,
      })
      queryClient.setQueryData(LikeBookmarkQueryKeys.likeCount(playlistId), updatedLikeCount)

      return { previousUserLike, previousPlaylistLikes }
    },
    onError: (_error, _newState, context) => {
      if (context?.previousUserLike || context?.previousPlaylistLikes) {
        queryClient.setQueryData(
          LikeBookmarkQueryKeys.userLike(playlistId),
          context.previousUserLike,
        )
        queryClient.setQueryData(
          LikeBookmarkQueryKeys.likeCount(playlistId),
          context.previousUserLike,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: LikeBookmarkQueryKeys.userLike(playlistId),
      })
      queryClient.invalidateQueries({
        queryKey: LikeBookmarkQueryKeys.likeCount(playlistId),
      })
    },
  })
  return {
    toggleLike,
    likeLoading,
  }
}
