import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'

export const usePlaylistLike = (playlistId?: string) => {
  const { profile } = useGetAuthState()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // 사용자가 좋아요를 눌렀는지 여부
  const { data: fetchedIsLiked } = useQuery<boolean>({
    queryKey: ['playlist_liked', playlistId, profile?.id],
    queryFn: async () => {
      if (!profile) return false
      const { data } = await supabase
        .from('playlists_likes')
        .select('id')
        .eq('user_id', profile.id)
        .eq('playlist_id', playlistId)
        .maybeSingle()
      return !!data
    },
    enabled: !!profile && !!playlistId,
  })

  // 좋아요 여부 동기화
  useEffect(() => {
    if (fetchedIsLiked !== undefined) setIsLiked(fetchedIsLiked)
  }, [fetchedIsLiked])

  // 좋아요 수 가져오기
  useEffect(() => {
    const fetchLikeCount = async () => {
      const { data } = await supabase
        .from('playlists')
        .select('like_count')
        .eq('id', playlistId)
        .single()
      if (data?.like_count != null) {
        setLikeCount(data.like_count)
      }
    }
    fetchLikeCount()
  }, [playlistId])

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
    onMutate: async () => {
      const prev = isLiked
      const newState = !prev
      const count = newState ? likeCount + 1 : likeCount - 1

      setIsLiked(newState)
      setLikeCount(count)

      return { prev, newState, count }
    },
    onError: (_error, _newState, context) => {
      if (context) {
        setIsLiked(context.prev)
        setLikeCount(context.count)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlist_liked', playlistId, profile?.id],
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
