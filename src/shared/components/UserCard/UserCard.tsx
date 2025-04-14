import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'
import { useNavigate } from 'react-router-dom'

interface UserCardProps {
  profileId?: string
  nickname: string
  size?: 'small' | 'medium'
  className?: string
  listCount?: number
}

export function UserCard({
  profileId,
  nickname,
  className,
  size = 'small',
  listCount,
}: UserCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (profileId) {
      // 프로필 페이지로 이동
      navigate(`/profile/${profileId}`)
    }
  }

  if (!nickname && size === 'small') {
    return (
      <div className={cn('flex items-center gap-3', className)} onClick={handleClick}>
        <Avatar size="small">
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <span className="text-c300 text-textR">불러오는 중...</span>
      </div>
    )
  } else if (nickname && size === 'small') {
    return (
      <div className={cn('flex items-center gap-3', className)} onClick={handleClick}>
        <Avatar size="small">
          <AvatarFallback>{nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-c300 text-textR">{nickname}</span>
      </div>
    )
  }

  if (nickname && size === 'medium') {
    return (
      <div className={cn('text-h3 flex items-center gap-[24px]', className)} onClick={handleClick}>
        <Avatar size="medium">
          <AvatarImage src="" alt={nickname} />
          <AvatarFallback>{nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h3 className="text-c50">{nickname}</h3>
          <div className="text-c300 text-textR">리스트 {listCount || 0}개</div>
        </div>
      </div>
    )
  } else if (!nickname && size === 'medium') {
    return (
      <div className={cn('text-h3 flex items-center gap-[24px]', className)} onClick={handleClick}>
        <Avatar size="medium">
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <span className="text-c300">불러오는 중...</span>
      </div>
    )
  }
}
