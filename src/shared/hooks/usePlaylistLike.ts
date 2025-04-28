import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { usePlaylistLikeCount, useUserLike } from '../queries/usePlaylistLikeQuery'
import { usePlaylistLikeMutation } from '../queries/usePlaylistLikeMutation'

export const usePlaylistLike = (playlistId?: string) => {
  const { profile } = useGetAuthState()

  const { data: isLiked = false } = useUserLike(profile, playlistId) // 사용자가 좋아요를 눌렀는지 여부
  const { data: likeCount = 0 } = usePlaylistLikeCount(playlistId)

  // Mutation 적용: 좋아요 추가/삭제
  const { toggleLike, likeLoading } = usePlaylistLikeMutation({ likeCount, profile, playlistId })

  return {
    isLiked,
    likeCount,
    toggleLike: () => toggleLike(!isLiked),
    likeLoading,
  }
}
