import { Skeleton } from '@/shared/components/ui/skeleton'

const HomePageSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* 플레이리스트 카드 스켈레톤 */}
      <div className="relative">
        <div className="absolute top-12 z-10 h-full w-full">
          <div className="bg-c700 w-full space-y-5 p-[30px]">
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-7 w-1/2" />
          </div>
        </div>
        <div className="absolute top-80 h-full w-full space-y-5 p-[30px]">
          <Skeleton className="bg-c800 aspect-video w-full rounded-xl" />
          <Skeleton className="bg-c800 h-9 w-3/4" />
        </div>
      </div>
    </div>
  )
}

export default HomePageSkeleton
