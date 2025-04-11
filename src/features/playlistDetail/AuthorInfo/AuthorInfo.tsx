import { Heart, Bookmark } from 'lucide-react'
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'

interface AuthorInfoProps {
  authorName: string | undefined
  likeCount: number | undefined
  subscriberCount: number | undefined
}

export default function AuthorInfo({
  authorName = '짜파게티오리사',
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
        {/* 좋아요 수 */}
        <div className="flex flex-col items-center">
          <Heart className="h-7 w-7 text-slate-300" />
          <span className="mt-1 text-sm text-slate-400">{likeCount}</span>
        </div>
        {/* 북마크 수 */}
        <div className="flex flex-col items-center">
          <Bookmark className="h-7 w-7 text-slate-300" />
          <span className="mt-1 text-sm text-slate-400">{subscriberCount}</span>
        </div>
      </div>
    </div>
  )
}
