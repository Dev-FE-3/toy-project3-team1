import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'

interface UserCardProps {
  imageUrl?: string
  name: string
  className?: string
}

export function UserCard({ imageUrl, name, className }: UserCardProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar className="h-8 w-8">
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} />
        ) : (
          <AvatarFallback>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-medium text-c50">{name}</span>
    </div>
  )
}