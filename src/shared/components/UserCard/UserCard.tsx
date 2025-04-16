import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'
import { useNavigate } from 'react-router-dom'

interface UserCardProps {
  profileId?: string
  nickname?: string
  size?: 'small' | 'medium' | 'large'
  nicknameActive?: boolean
  className?: string
  listCount?: number
}

export function UserCard({
  profileId,
  nickname,
  className,
  size = 'small',
  nicknameActive = true,
  listCount,
}: UserCardProps) {
  const navigate = useNavigate()

  const fallbackText = nickname?.slice(0, 2).toUpperCase() ?? ''
  const isLoading = !nickname

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (profileId) navigate(`/profile/${profileId}`)
  }

  const renderText = () => {
    if (size === 'medium') {
      return (
        <div className="flex flex-col gap-2">
          <h3 className="text-c50">{nickname}</h3>
          <div className="text-c300 text-textR">리스트 {listCount ?? 0}개</div>
        </div>
      )
    }

    if (size === 'small') {
      return <span className="text-c300 text-textR">{isLoading ? '불러오는 중...' : nickname}</span>
    }

    return null
  }

  return (
    <div
      className={cn(
        'flex items-center',
        size === 'small' && 'gap-3',
        size === 'medium' && 'text-h3 gap-[24px]',
        size === 'large' && 'text-h2 gap-[24px]',
        className,
      )}
      onClick={handleClick}
    >
      <Avatar size={size}>
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
      {nicknameActive && renderText()}
    </div>
  )
}
