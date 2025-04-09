import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'

interface UserCardProps {
  imageUrl?: string
  name: string
  className?: string
}

export function UserCard({ imageUrl, name, className }: UserCardProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar size="small">
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} className="object-cover" />
        ) : (
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <span className="text-c50 text-textR">{name}</span>
    </div>
  )
}
