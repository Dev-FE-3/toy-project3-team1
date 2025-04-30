import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../model/lib/queryClient'
import { LikeBookmarkQueryKeys } from './LikeBookmarkQueryKeys'
import { useToast } from '../store/toastStore'
import { User } from '@supabase/supabase-js'
import { playlistBookmarkService } from '../services/playlistBookmarkService'

interface Props {
  bookmarkCount: number
  profile: User | null
  playlistId: string | undefined
}

export const usePlaylistBookmarkMutation = ({ bookmarkCount, profile, playlistId }: Props) => {
  const { success: toastSuccess, error: toastError } = useToast()
  const { mutate: toggleBookmark, isPending: bookmarkLoading } = useMutation({
    mutationFn: async (newState: boolean) => {
      if (!profile) return

      if (newState) {
        await playlistBookmarkService.updatePlaylistBookmark(profile.id, playlistId)
        toastSuccess('구독 리스트에 추가되었습니다.')
      } else {
        await playlistBookmarkService.deletePlaylistBookmark(profile.id, playlistId)
        toastSuccess('구독 리스트에서 제외되었습니다.')
      }
    },
    onMutate: async (newState) => {
      // 기존 데이터를 가져오고, 북마크 상태와 카운트를 업데이트
      const previousBookmarkCount = queryClient.getQueryData(
        LikeBookmarkQueryKeys.bookmarkCount(playlistId),
      )
      const previousUserBookmark = queryClient.getQueryData(
        LikeBookmarkQueryKeys.userBookmark(playlistId),
      )

      const updatedBookmarkCount = newState ? bookmarkCount + 1 : bookmarkCount - 1

      queryClient.setQueryData(LikeBookmarkQueryKeys.userBookmark(playlistId), newState)
      queryClient.setQueryData(
        LikeBookmarkQueryKeys.bookmarkCount(playlistId),
        updatedBookmarkCount,
      )

      return { previousBookmarkCount, previousUserBookmark }
    },
    onError: (_err, _newState, context) => {
      if (context?.previousBookmarkCount || context?.previousUserBookmark) {
        queryClient.setQueryData(
          LikeBookmarkQueryKeys.bookmarkCount(playlistId),
          context.previousBookmarkCount,
        )
        queryClient.setQueryData(
          LikeBookmarkQueryKeys.userBookmark(playlistId),
          context.previousUserBookmark,
        )
      }
      toastError('구독 리스트 업데이트를 실패했습니다.')
    },
    onSettled: () => {
      // 쿼리 무효화 및 데이터 최신화
      queryClient.invalidateQueries({
        queryKey: LikeBookmarkQueryKeys.bookmarkCount(playlistId),
      })
      queryClient.invalidateQueries({
        queryKey: LikeBookmarkQueryKeys.userBookmark(playlistId),
      })
    },
  })
  return {
    toggleBookmark,
    bookmarkLoading,
  }
}
