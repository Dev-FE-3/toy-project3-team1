import { useMutation } from '@tanstack/react-query'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '../model/lib/queryClient'
import { useToast } from '../store/toastStore'
import { usefetchBookmarks } from '../queries/usePlaylistBookmarkQuery'
import { LikeBookmarkQueryKeys } from '../queries/LikeBookmarkQueryKeys'
import { deletePlaylistBookmark, updatePlaylistBookmark } from '../services/playlistBookmarkService'

export const usePlaylistBookmark = (playlistId: string) => {
  const { profile } = useGetAuthState()
  const { success: toastSuccess, error: toastError } = useToast()

  // 사용자가 북마크했는지 여부와 북마크 수를 가져오기
  const { data: fetchedBookmark } = usefetchBookmarks(profile, playlistId)

  const isBookmarked = fetchedBookmark?.isBookmarked ?? false
  const bookmarkCount = fetchedBookmark?.bookmarkCount ?? 0

  // Mutation 적용: 북마크 추가/삭제
  const { mutate: toggleBookmark, isPending: bookmarkLoading } = useMutation({
    mutationFn: async (newState: boolean) => {
      if (!profile) return

      if (newState) {
        await updatePlaylistBookmark(profile.id, playlistId)
        toastSuccess('구독 리스트에 추가되었습니다.')
      } else {
        await deletePlaylistBookmark(profile.id, playlistId)
        toastSuccess('구독 리스트에서 제외되었습니다.')
      }
    },
    onMutate: async (newState) => {
      // 기존 데이터를 가져오고, 북마크 상태와 카운트를 업데이트
      const previousBookmark = queryClient.getQueryData([
        LikeBookmarkQueryKeys.bookmark(playlistId),
      ])

      const updatedBookmarkCount = newState ? bookmarkCount + 1 : bookmarkCount - 1

      queryClient.setQueryData([LikeBookmarkQueryKeys.bookmark(playlistId)], {
        isBookmarked: newState,
        bookmarkCount: updatedBookmarkCount,
      })

      return { previousBookmark }
    },
    onError: (_err, _newState, context) => {
      if (context?.previousBookmark) {
        queryClient.setQueryData(
          [LikeBookmarkQueryKeys.bookmark(playlistId)],
          context.previousBookmark,
        )
      }
      toastError('구독 리스트 업데이트를 실패했습니다.')
    },
    onSettled: () => {
      // 쿼리 무효화 및 데이터 최신화
      queryClient.invalidateQueries({
        queryKey: [LikeBookmarkQueryKeys.bookmark(playlistId)],
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
