import { Bookmark } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils'

interface BookmarkIconProps extends React.SVGProps<SVGSVGElement> {
  isBookmarked?: boolean
  size?:number
}

export default function BookmarkIcon({
  isBookmarked = false,
  size,
  className,
  ...props
}: BookmarkIconProps) {
  return (
    <Bookmark
    size={size}
    strokeWidth={1.5}
      className={cn(
        'transition-colors duration-300',
        isBookmarked ? 'fill-c200 text-c200' : 'fill-c700 text-c400',
        className,
      )}
      {...props}
    />
  )
}
