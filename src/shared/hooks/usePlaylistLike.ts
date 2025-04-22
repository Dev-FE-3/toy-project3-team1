import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'

export const usePlaylistLike = (playlistId?: string) => {
  const { profile } = useGetAuthState()

  // 사용자가 좋아요를 눌렀는지 여부
  const { data: fetchedIsLiked } = useQuery({
    queryKey: ['playlist_liked', playlistId],
    queryFn: async () => {
      if (!profile) return { isLiked: false, likeCount: 0 }

      const { data: isLikedData } = await supabase
        .from('playlists_likes')
        .select('id')
        .eq('user_id', profile.id)
        .eq('playlist_id', playlistId)
        .maybeSingle()

      const isLiked = !!isLikedData

      const { count } = await supabase
        .from('playlists_likes')
        .select('id', { count: 'exact' })
        .eq('playlist_id', playlistId)

      return { isLiked, likeCount: count || 0 }
    },
    enabled: !!profile && !!playlistId,
  })

  const isLiked = fetchedIsLiked?.isLiked ?? false
  const likeCount = fetchedIsLiked?.likeCount ?? 0

  // Mutation 적용: 좋아요 추가/삭제
  const { mutate: toggleLike, isPending: likeLoading } = useMutation({
    mutationFn: async (newState: boolean) => {
      if (!profile) return

      if (newState) {
        await supabase.from('playlists_likes').insert({
          user_id: profile.id,
          playlist_id: playlistId,
        })
      } else {
        await supabase
          .from('playlists_likes')
          .delete()
          .eq('user_id', profile.id)
          .eq('playlist_id', playlistId)
      }
    },
    onMutate: async (newState) => {
      const previousLike = queryClient.getQueryData(['playlist_liked', playlistId])

      const updatedLikeCount = newState ? likeCount + 1 : likeCount - 1

      queryClient.setQueryData(['playlist_liked', playlistId], {
        isLiked: newState,
        likeCount: updatedLikeCount,
      })

      return { previousLike }
    },
    onError: (_error, _newState, context) => {
      if (context?.previousLike) {
        queryClient.setQueryData(['playlist_liked', playlistId], context.previousLike)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlist_liked', playlistId],
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
