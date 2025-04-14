import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'

export const usePlaylistLike = (playlistId: string) => {
  const { profile } = useGetAuthState()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const queryClient = useQueryClient()

  const { data: isLike } = useQuery<boolean>({
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
    enabled: !!profile,
  })

  useEffect(() => {
    if (isLike !== undefined) setIsLiked(isLike)
  }, [isLike])

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

  const toggleLike = async () => {
    if (!profile) return

    const prev = isLiked
    const newState = !prev
    const count = newState ? likeCount + 1 : likeCount - 1

    setIsLiked(newState)
    setLikeCount(count)

    try {
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
      queryClient.invalidateQueries({
        queryKey: ['playlist_liked', playlistId, profile?.id],
      })
    } catch (err) {
      console.error('Like 처리 실패:', err)
      setIsLiked(prev)
      setLikeCount(prev ? count - 1 : count + 1)
    }
  }

  return { isLiked, likeCount, toggleLike }
}
