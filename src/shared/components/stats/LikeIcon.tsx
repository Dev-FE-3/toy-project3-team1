import { Heart } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils' // shadcn/ui의 className 병합 유틸리티 (선택 사항)

interface LikeIconProps extends React.SVGProps<SVGSVGElement> {
  isLiked?: boolean
}

export default function LikeIcon({ isLiked = false, className, ...props }: LikeIconProps) {
  return (
    <Heart
      className={cn('h-5 w-5', isLiked ? 'fill-(--400) text-(--400)' : 'text-(--400)', className)}
      {...props}
    />
  )
}
