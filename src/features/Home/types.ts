// 최대값을 4로 제한하는 유틸리티 함수
export const ensureValidCount = (count: number) => {
  return Math.min(count, 4)
}

// 카테고리 컴포넌트의 props 타입
export type CategoryProps = {
  children?: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
}

// 카테고리 목록 컴포넌트의 props 타입
export type CategoriesProps = {
  count: number
}
