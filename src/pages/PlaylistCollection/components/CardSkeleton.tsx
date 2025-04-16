import { Skeleton } from '@/shared/components/ui/skeleton'

export const CardSkeleton = () => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* 썸네일 스켈레톤 */}
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />
      </div>

      {/* 제목 스켈레톤 */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* 메타 정보 스켈레톤 */}
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
