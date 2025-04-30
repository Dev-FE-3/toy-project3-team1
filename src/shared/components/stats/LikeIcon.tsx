import { Heart } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils' // shadcn/ui의 className 병합 유틸리티 (선택 사항)

interface LikeIconProps extends React.SVGProps<SVGSVGElement> {
  isLiked?: boolean
  size?: number
}

export default function LikeIcon({ isLiked = false, size, className, ...props }: LikeIconProps) {
  return (
    <Heart
      size={size}
      strokeWidth={1.5}
      className={cn(
        'transition-colors duration-300',
        isLiked ? 'fill-c200 text-c200' : 'fill-c700 text-c400',
        className,
      )}
      {...props}
    />
  )
}
