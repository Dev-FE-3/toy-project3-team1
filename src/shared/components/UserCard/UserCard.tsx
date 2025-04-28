import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/model/lib/utils'
import { Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface UserCardProps {
  profileId?: string
  nickname?: string
  size?: 'xsmall' | 'small' | 'medium' | 'large'
  nicknameActive?: boolean
  className?: string
  listCount?: number | null
  showEditButton?: boolean
  onEditClick?: () => void
  imageSrc?: string
}

export function UserCard({
  profileId,
  nickname,
  className,
  size = 'small',
  nicknameActive = true,
  listCount,
  showEditButton = false,
  onEditClick,
  imageSrc,
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
        'text-captionM flex cursor-pointer items-center',
        size === 'xsmall' && 'text-captionS',
        size === 'small' && 'gap-3',
        size === 'medium' && 'text-h3 gap-[24px]',
        size === 'large' && 'text-h2 gap-[24px]',
        className,
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar size={size}>
          {imageSrc && <AvatarImage src={imageSrc} />}
          <AvatarFallback className="text-c400">{fallbackText}</AvatarFallback>
        </Avatar>
        {showEditButton && (
          <span
            className="bg-c700/70 text-c100 absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow"
            onClick={(e) => {
              e.stopPropagation()
              onEditClick?.()
            }}
          >
            <Camera size={20} />
          </span>
        )}
      </div>
      {nicknameActive && renderText()}
    </div>
  )
}
