import { CATEGORY_COUNT_LIMIT } from "../constants/CATEGORY_COUNT_LIMIT"

export const limitCategoryCount = (count: number): number => {
  return Math.min(count, CATEGORY_COUNT_LIMIT)
}
