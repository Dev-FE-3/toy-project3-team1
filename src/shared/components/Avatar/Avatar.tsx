import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'

type AvatarSize = 'small' | 'medium' | 'large'

type AvatarProps = {
  size?: AvatarSize
}

const AVATAR_SIZES = {
  small: 'h-[40px] w-[40px]',
  medium: 'h-[80px] w-[80px]',
  large: 'h-[130px] w-[130px]',
} as const

export default function Avatar({ size = 'small' }: AvatarProps) {
  return (
    <AvatarComponent className={AVATAR_SIZES[size]}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </AvatarComponent>
  )
}
