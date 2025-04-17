import { UserCard } from '@/shared/components/UserCard/UserCard'
import { usePlaylistBookmark } from '@/shared/hooks/usePlayBookmark'
import { usePlaylistLike } from '@/shared/hooks/usePlaylistLike'
import { cn } from '@/shared/model/lib/utils'
import { Bookmark, Heart } from 'lucide-react'

interface AuthorInfoProps {
  authorName: string | undefined
  isOwner: boolean
  hashTag?: string[]
  // likeCount: number | undefined
  subscriberCount: number | undefined
  playlistId: string
}

export default function AuthorInfo({
  authorName = 'R',
  isOwner = false,
  hashTag = [],
  // likeCount = 0,
  // subscriberCount = 0,
  playlistId,
}: AuthorInfoProps) {
  const { isLiked, likeCount, toggleLike } = usePlaylistLike(playlistId)
  const { isBookmarked, bookmarkCount, toggleBookmark } = usePlaylistBookmark(playlistId)

  const handleLike = () => {
    toggleLike()
  }

  const handleBookmark = () => {
    console.log('bookmark')
    toggleBookmark()
  }

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 작성자 정보 */}
        <div className="flex flex-col gap-2">
          <UserCard nickname={authorName} />
          {/* 플리 해시태그 */}
          {hashTag && hashTag.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hashTag.map((tagName, idx) => (
                <span key={idx} className="text-c400 text-sm">
                  {`# ${tagName}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 오른쪽: 좋아요/북마크 버튼 */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center">
            <Heart
              className={cn('text-c300 h-7 w-7 cursor-pointer', isLiked ? 'fill-c300' : '')}
              onClick={handleLike}
            />
            {/* 좋아요 수 */}
            <span className="text-c400 mt-1 text-sm">{likeCount}</span>
          </div>
          <div className="flex flex-col items-center">
            {/* 작성자 본인일 경우 색상 칠하기 */}
            <Bookmark
              className={cn(
                'text-c300 h-7 w-7',
                isOwner || isBookmarked ? 'fill-c300' : 'cursor-pointer',
              )}
              onClick={isOwner ? undefined : handleBookmark}
            />
            {/* 구독자 수 */}
            <span className={cn('text-c400 text-c300 mt-1 text-sm')}>{bookmarkCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
