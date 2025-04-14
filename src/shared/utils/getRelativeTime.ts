import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

// dayjs 설정
dayjs.extend(relativeTime)
dayjs.locale('ko')

// 상대 시간을 구하는 함수
export const getRelativeTime = (date: string) => {
  return dayjs(date).fromNow()
}
