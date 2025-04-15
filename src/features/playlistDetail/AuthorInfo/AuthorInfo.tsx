import { Heart, Bookmark } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils'
import { UserCard } from '@/shared/components/UserCard/UserCard'

interface AuthorInfoProps {
  authorName: string | undefined
  isOwner: boolean
  likeCount: number | undefined
  subscriberCount: number | undefined
}

export default function AuthorInfo({
  authorName = 'R',
  isOwner = false,
  likeCount = 0,
  subscriberCount = 0,
}: AuthorInfoProps) {
  return (
    <div className="mt-4 mb-4 flex items-center justify-between">
      <UserCard nickname={authorName} />

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center">
          <Heart className="text-c300 h-7 w-7" />
          {/* 좋아요 수 */}
          <span className="text-c400 mt-1 text-sm">{likeCount}</span>
        </div>
        {/* 북마크 수 */}
        <div className="flex flex-col items-center">
          {/* 작성자 본인일 경우 색상 칠하기 */}
          <Bookmark className={cn('text-c300 h-7 w-7', isOwner && 'fill-c300')} />
          {/* 구독자 수 */}
          <span className="text-c400 mt-1 text-sm">{subscriberCount}</span>
        </div>
      </div>
    </div>
  )
}
