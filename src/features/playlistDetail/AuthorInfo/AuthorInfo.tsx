import { Heart, Bookmark } from 'lucide-react'
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'

interface AuthorInfoProps {
  authorName: string | undefined
  isOwner: boolean
  likeCount: number | undefined
  subscriberCount: number | undefined
}

export default function AuthorInfo({
  authorName = '짜파게티오리사',
  isOwner = false,
  likeCount = 332,
  subscriberCount = 21,
}: AuthorInfoProps) {
  return (
    <div className="mt-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AvatarComponent className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="작성자 이미지" />
          <AvatarFallback>JK</AvatarFallback>
        </AvatarComponent>
        <div>
          <p className="text-lg font-medium text-white">{authorName}</p>
        </div>
      </div>

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
