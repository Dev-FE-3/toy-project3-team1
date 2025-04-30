import { AvatarImage } from '@radix-ui/react-avatar'
import Avatar from '../Avatar/Avatar'
import { useProfileSharedQuery } from '@/shared/queries/profileSharedQuery'

interface Props {
  size: 'xsmall' | 'small' | 'medium' | 'large'
  profileId: string | undefined
  fallback?: React.ReactNode
}

export const AvatarContainer = ({ size, profileId, fallback }: Props) => {
  if (!profileId) {
    return <Avatar size={size} fallback={fallback} />
  }
  const { data: authorImageSrc } = useProfileSharedQuery(profileId)
  return (
    <Avatar size={size} fallback={fallback}>
      {authorImageSrc && (
        <AvatarImage className="h-full w-full object-cover bg-c600" src={authorImageSrc} />
      )}
    </Avatar>
  )
}
