import { useQuery, useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'

export const usePlaylistBookmark = (playlistId: string) => {
  const { profile } = useGetAuthState()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)

  // 사용자가 북마크했는지 여부
  const { data: fetchedIsBookmarked } = useQuery<boolean>({
    queryKey: ['playlist_bookmarked', playlistId, profile?.id],
    queryFn: async () => {
      if (!profile) return false
      const { data } = await supabase
        .from('playlists_subscribers')
        .select('id')
        .eq('user_id', profile.id)
        .eq('playlist_id', playlistId)
        .maybeSingle()
      return !!data
    },
    enabled: !!profile && !!playlistId,
  })

  // 북마크 여부 동기화
  useEffect(() => {
    if (fetchedIsBookmarked !== undefined) setIsBookmarked(fetchedIsBookmarked)
  }, [fetchedIsBookmarked])

  // 북마크 수 가져오기
  useEffect(() => {
    const fetchBookmarkCount = async () => {
      const { data } = await supabase
        .from('playlists')
        .select('subscriber_count')
        .eq('id', playlistId)
        .single()
      if (data?.subscriber_count != null) {
        setBookmarkCount(data.subscriber_count)
      }
    }
    fetchBookmarkCount()
  }, [playlistId])

  // Mutation 적용: 북마크 추가/삭제
  const { mutate: toggleBookmark, isPending: bookmarkLoading } = useMutation({
    mutationFn: async (newState: boolean) => {
      if (!profile) return

      if (newState) {
        await supabase.from('playlists_subscribers').insert({
          user_id: profile.id,
          playlist_id: playlistId,
        })
      } else {
        await supabase
          .from('playlists_subscribers')
          .delete()
          .eq('user_id', profile.id)
          .eq('playlist_id', playlistId)
      }
    },
    onMutate: async () => {
      const prev = isBookmarked
      const newState = !prev
      const count = newState ? bookmarkCount + 1 : bookmarkCount - 1

      setIsBookmarked(newState)
      setBookmarkCount(count)

      return { prev, count }
    },
    onError: (_error, _newState, context) => {
      // 실패 시 롤백
      if (context) {
        setIsBookmarked(context.prev)
        setBookmarkCount(context.prev ? context.count + 1 : context.count - 1)
      }
    },
    onSettled: () => {
      // 데이터 최신화
      queryClient.invalidateQueries({
        queryKey: ['playlist_bookmarked', playlistId, profile?.id],
      })
    },
  })

  return {
    isBookmarked,
    bookmarkCount,
    toggleBookmark: () => toggleBookmark(!isBookmarked),
    bookmarkLoading,
  }
}
