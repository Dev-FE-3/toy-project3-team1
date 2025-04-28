<<<<<<< HEAD
import { playlistCollectionKeys } from '@/pages/PlaylistCollection/queries/playlistCollectionQueryKeys'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { queryClient } from '../model/lib/queryClient'
=======
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import {
  usePlaylistBookmarkCount,
  useUserPlaylistBookmark,
} from '../queries/usePlaylistBookmarkQuery'
import { usePlaylistBookmarkMutation } from '../queries/usePlaylistBookmarkMutation'
>>>>>>> dev

export const usePlaylistBookmark = (playlistId: string) => {
  const { profile } = useGetAuthState()

  // 사용자가 북마크했는지 여부와 북마크 수를 가져오기
  const { data: isBookmarked = false } = useUserPlaylistBookmark(profile, playlistId)
  const { data: bookmarkCount = 0 } = usePlaylistBookmarkCount(playlistId)

  // Mutation 적용: 북마크 추가/삭제
<<<<<<< HEAD
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
      // 구독(북마크) 컬렉션 쿼리도 invalidate
      if (profile?.id) {
        queryClient.invalidateQueries({
          queryKey: playlistCollectionKeys.list(profile.id, 'subscribedPlaylists'),
        })
      }
    },
=======
  const { toggleBookmark, bookmarkLoading } = usePlaylistBookmarkMutation({
    bookmarkCount,
    profile,
    playlistId,
>>>>>>> dev
  })

  return {
    isBookmarked,
    bookmarkCount,
    toggleBookmark: () => toggleBookmark(!isBookmarked),
    bookmarkLoading,
  }
}
