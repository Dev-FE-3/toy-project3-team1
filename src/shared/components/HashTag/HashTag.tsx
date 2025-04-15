import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/model/lib/utils'

interface HashTagProps {
  tag: string
  size?: 'small' | 'medium'
  className?: string
  onClick?: () => void
}

export default function HashTag({ size = 'medium', tag, className, onClick }: HashTagProps) {
  // "#" 기호가 이미 포함되어 있는지 확인하고, 없으면 추가
  const displayText = tag.startsWith('#') ? tag : `# ${tag}`

  if (size === 'medium') {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'border-c400 bg-c700 text-c400 !text-textM rounded-full px-[11px] pt-[4px] pb-[6px]',
          'cursor-pointer transition-colors',
          className,
        )}
        onClick={onClick}
      >
        {displayText}
      </Badge>
    )
  } else {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'border-c400 bg-c700 text-c400 !text-captionM rounded-full px-[8px] pt-[3px] pb-[4px]',
          'cursor-pointer transition-colors',
          className,
        )}
        onClick={onClick}
      >
        {displayText}
      </Badge>
    )
  }
}
