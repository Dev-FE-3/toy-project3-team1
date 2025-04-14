import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'

export const usePlaylistBookmark = (playlistId: string) => {
  const { profile } = useGetAuthState()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)

  const { data: isBookmark } = useQuery<boolean>({
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
    enabled: !!profile,
  })

  useEffect(() => {
    if (isBookmark !== undefined) setIsBookmarked(isBookmark)
  }, [isBookmark])

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

  const toggleBookmark = async () => {
    if (!profile) return

    const prev = isBookmarked
    const newState = !prev
    const count = newState ? bookmarkCount + 1 : bookmarkCount - 1

    setIsBookmarked(newState)
    setBookmarkCount(count)

    try {
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
      queryClient.invalidateQueries({
        queryKey: ['playlist_bookmarked', playlistId, profile?.id],
      })
    } catch (err) {
      console.error('Bookmark 처리 실패:', err)
      setIsBookmarked(prev)
      setBookmarkCount(prev ? count - 1 : count + 1)
    }
  }

  return { isBookmarked, bookmarkCount, toggleBookmark }
}
