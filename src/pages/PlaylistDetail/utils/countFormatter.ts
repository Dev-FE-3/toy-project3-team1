interface CountFormatterProps {
  count: string | number
}

export const countFormatter = ({ count }: CountFormatterProps): string => {
  const num = typeof count === 'string' ? parseInt(count, 10) : count

  if (isNaN(num)) return '0'

  if (num >= 100000000) {
    // 1억 이상
    return `${(num / 100000000).toFixed(1)}억`
  }
  if (num >= 10000) {
    // 1만 이상
    return `${(num / 10000).toFixed(1)}만`
  }
  if (num >= 1000) {
    // 1천 이상
    return `${(num / 1000).toFixed(1)}천`
  }

  return num.toString()
}
