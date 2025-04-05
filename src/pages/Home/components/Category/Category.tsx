import { CategoryProps } from "../../types"

export const Category = ({ children, isSelected, onClick }: CategoryProps) => {
  return (
    <span
      className={`bg-800 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-1 border-400 ${!isSelected ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}