import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/model/lib/utils'

interface HashTagProps {
  tag: string
  className?: string
  onClick?: () => void
}

export default function HashTag({ tag, className, onClick }: HashTagProps) {
  // "#" 기호가 이미 포함되어 있는지 확인하고, 없으면 추가
  const displayText = tag.startsWith('#') ? tag : `#${tag}`

  return (
    <Badge
      variant="secondary"
      className={cn(
        'rounded-full border-c400 bg-c700 px-4 py-2 text-c400',
        'cursor-pointer transition-colors',
        className,
      )}
      onClick={onClick}
    >
      {displayText}
    </Badge>
  )
}
