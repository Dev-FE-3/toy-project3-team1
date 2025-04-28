import { useMutation } from '@tanstack/react-query'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'
import { deletePlaylistLike, updatePlaylistLike } from '../services/playlistLikeServiece'
import { usePlaylistLikeCount, useUserLike } from '../queries/usePlaylistLikeQuery'
import { LikeBookmarkQueryKeys } from '../queries/LikeBookmarkQueryKeys'

export const usePlaylistLike = (playlistId?: string) => {
  const { profile } = useGetAuthState()

  // 사용자가 좋아요를 눌렀는지 여부
  // const { data: fetchedLikes } = usefetchLikes(profile, playlistId)

  const { data: isLiked = false } = useUserLike(profile, playlistId)
  const { data: likeCount = 0 } = usePlaylistLikeCount(playlistId)

  // Mutation 적용: 좋아요 추가/삭제
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
      queryClient.setQueryData(LikeBookmarkQueryKeys.likeCount(playlistId), {
        likeCount: updatedLikeCount,
      })

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
    isLiked,
    likeCount,
    toggleLike: () => toggleLike(!isLiked),
    likeLoading,
  }
}
