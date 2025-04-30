import { Skeleton } from '@/shared/components/ui/skeleton'

export const CardSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-600">
      {/* Card 구조와 동일한 flex wrapper */}
      <div className="flex flex-col">
        {/* 썸네일 스켈레톤 */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        {/* 텍스트 영역 스켈레톤: Card의 section과 동일하게 relative + padding 처리 */}
        <section className="relative flex items-start justify-between p-2">
          <div className="flex-1 overflow-hidden">
            {/* 제목 스켈레톤 */}
            <Skeleton className="mb-1 h-5 w-3/4" />
            {/* 메타 정보 스켈레톤 */}
            <Skeleton className="h-4 w-1/4" />
          </div>
          {/* 더보기 메뉴 아이콘 스켈레톤 */}
          <Skeleton className="h-6 w-6" />
        </section>
      </div>
    </div>
  )
}
