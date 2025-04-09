import { CategoryProps } from '../../types'

export const Category = ({ children, isSelected, onClick }: CategoryProps) => {
  return (
    <span
      className={`bg-c800 border-c400 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-1 ${!isSelected ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
