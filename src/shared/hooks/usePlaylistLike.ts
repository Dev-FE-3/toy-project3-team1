import { useMutation } from '@tanstack/react-query'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'
import { deletePlaylistLike, updatePlaylistLike } from '../services/playlistLikeServiece'
import { usefetchLikes } from '../queries/usePlaylistLikeQuery'
import { LikeBookmarkQueryKeys } from '../queries/LikeBookmarkQueryKeys'

export const usePlaylistLike = (playlistId?: string) => {
  const { profile } = useGetAuthState()

  // 사용자가 좋아요를 눌렀는지 여부
  const { data: fetchedLikes } = usefetchLikes(profile, playlistId)

  const isLiked = fetchedLikes?.isLiked ?? false
  const likeCount = fetchedLikes?.likeCount ?? 0

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
      const previousLike = queryClient.getQueryData([LikeBookmarkQueryKeys.like(playlistId)])

      const updatedLikeCount = newState ? likeCount + 1 : likeCount - 1

      queryClient.setQueryData([LikeBookmarkQueryKeys.like(playlistId)], {
        isLiked: newState,
        likeCount: updatedLikeCount,
      })

      return { previousLike }
    },
    onError: (_error, _newState, context) => {
      if (context?.previousLike) {
        queryClient.setQueryData([LikeBookmarkQueryKeys.like(playlistId)], context.previousLike)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [LikeBookmarkQueryKeys.like(playlistId)],
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
