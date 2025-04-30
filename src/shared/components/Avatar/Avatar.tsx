import { Avatar as AvatarComponent, AvatarFallback } from '@/shared/components/ui/avatar'

export type AvatarSize = 'small' | 'medium' | 'large'

type AvatarProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large'
  children?: React.ReactNode
  fallback?: React.ReactNode
}

const AVATAR_SIZES = {
  xsmall: 'h-[34px] w-[34px]',
  small: 'h-[40px] w-[40px]',
  medium: 'h-[80px] w-[80px]',
  large: 'h-[130px] w-[130px]',
} as const

export default function Avatar({ size = 'small', children, fallback }: AvatarProps) {
  return (
    <AvatarComponent className={AVATAR_SIZES[size]}>
      {children ?? <AvatarFallback className="text-c400">{fallback}</AvatarFallback>}
    </AvatarComponent>
  )
}
