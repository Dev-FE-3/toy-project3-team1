import { CategoryProps } from '../../model/types'

export const Category = ({ children, isSelected, onClick }: CategoryProps) => {
  return (
    <span
      className={`bg-c800 border-c400 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-[1.5px] ${!isSelected ? 'opacity-50 shadow-none' : 'shadow-[0_0_10px_rgba(255,255,255,0.3)]'}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
