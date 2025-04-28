import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import {
  usePlaylistBookmarkCount,
  useUserPlaylistBookmark,
} from '../queries/usePlaylistBookmarkQuery'
import { usePlaylistBookmarkMutation } from '../queries/usePlaylistBookmarkMutation'

export const usePlaylistBookmark = (playlistId: string) => {
  const { profile } = useGetAuthState()

  // 사용자가 북마크했는지 여부와 북마크 수를 가져오기
  const { data: isBookmarked = false } = useUserPlaylistBookmark(profile, playlistId)
  const { data: bookmarkCount = 0 } = usePlaylistBookmarkCount(playlistId)

  // Mutation 적용: 북마크 추가/삭제
  const { toggleBookmark, bookmarkLoading } = usePlaylistBookmarkMutation({
    bookmarkCount,
    profile,
    playlistId,
  })

  return {
    isBookmarked,
    bookmarkCount,
    toggleBookmark: () => toggleBookmark(!isBookmarked),
    bookmarkLoading,
  }
}
