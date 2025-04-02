import { Bookmark } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils'

interface BookmarkIconProps extends React.SVGProps<SVGSVGElement> {
  isBookmarked?: boolean
}

export default function BookmarkIcon({
  isBookmarked = false,
  className,
  ...props
}: BookmarkIconProps) {
  return (
    <Bookmark
      className={cn(
        'h-5 w-5',
        isBookmarked ? 'fill-(--400) text-(--400)' : 'text-(--400)',
        className,
      )}
      {...props}
    />
  )
}
