import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { usePlaylistBookmark } from '@/shared/hooks/usePlaylistBookmark'
import { usePlaylistLike } from '@/shared/hooks/usePlaylistLike'
import { cn } from '@/shared/model/lib/utils'
import { useProfileSharedQuery } from '@/shared/queries/profileSharedQuery'

interface AuthorInfoProps {
  ownerId: string
  authorName: string | undefined
  isOwner: boolean
  subscriberCount: number | undefined
  playlistId: string
}

export default function AuthorInfo({
  ownerId,
  authorName = 'R',
  isOwner = false,
  playlistId,
}: AuthorInfoProps) {
  const { isLiked, likeCount, toggleLike } = usePlaylistLike(playlistId)
  const { isBookmarked, bookmarkCount, toggleBookmark } = usePlaylistBookmark(playlistId)
  const { data: authorImageSrc } = useProfileSharedQuery(ownerId)

  const handleLike = () => {
    toggleLike()
  }

  const handleBookmark = () => {
    toggleBookmark()
  }

  return (
    <div className="mt-3 mb-4">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 작성자 정보 */}
        <UserCard
          nickname={authorName}
          profileId={ownerId}
          size="small"
          imageSrc={authorImageSrc || undefined}
        />
        {/* 오른쪽: 좋아요/북마크 버튼 */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <LikeIcon
              className={cn('text-c300 h-7 w-7 cursor-pointer', isLiked ? 'fill-c300' : '')}
              onClick={handleLike}
            />
            {/* 좋아요 수 */}
            <span className="text-c400 mt-1 text-sm">{likeCount}</span>
          </div>
          <div className="flex flex-col items-center">
            {/* 작성자 본인일 경우 색상 칠하기 */}
            <BookmarkIcon
              className={cn(
                'text-c300 h-7 w-7',
                isOwner || isBookmarked ? 'fill-c300' : 'cursor-pointer',
              )}
              onClick={isOwner ? undefined : handleBookmark}
            />
            {/* 구독자 수 */}
            <span className={cn('text-c400 mt-1 text-sm')}>{bookmarkCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
