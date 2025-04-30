import { cn } from '@/shared/model/lib/utils'
import { CategoryProps } from '../../model/types'

export const Category = ({ children, isSelected, onClick, className }: CategoryProps) => {
  return (
    <span
      className={cn(
        'bg-c800 border-c400 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[1.5px]',
        className,
        !isSelected ? 'opacity-50 shadow-none' : 'shadow-[0_0_10px_rgba(255,255,255,0.3)]',
      )}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
