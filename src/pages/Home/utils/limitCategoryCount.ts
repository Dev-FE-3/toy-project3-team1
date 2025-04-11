import { CATEGORY_COUNT_LIMIT } from "../constants/category"

export const limitCategoryCount = (count: number): number => {
  return Math.min(count, CATEGORY_COUNT_LIMIT)
}
