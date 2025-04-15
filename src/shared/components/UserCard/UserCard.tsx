import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'

interface UserCardProps {
  nickname: string
  nicknameActive?: boolean
  className?: string
}

export function UserCard({ nickname, nicknameActive = true, className }: UserCardProps) {
  if (!nickname) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Avatar size="small">
          <AvatarFallback>??</AvatarFallback>
        </Avatar>
        <span className="text-c300 text-textR">불러오는 중...</span>
      </div>
    )
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar size="small">
        <AvatarFallback>{nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {nicknameActive && <span className="text-c300 text-textR">{nickname}</span>}
    </div>
  )
}
