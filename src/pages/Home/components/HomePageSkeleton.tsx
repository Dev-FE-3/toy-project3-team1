import { Skeleton } from '@/shared/components/ui/skeleton'

const HomePageSkeleton = () => {
  return (
    <>
      {/* 플레이리스트 카드 스켈레톤 */}
      <div className="relative space-y-4">
        {/* 포커스된 플레이리스트 */}
        <div className="absolute top-12 z-10 h-full w-full">
          <div className="bg-c700 w-full space-y-5 p-[30px]">
            <Skeleton className="aspect-video rounded-xl" /> {/* 플레이리스트 썸네일 */}
            <Skeleton className="h-9 w-3/4" /> {/* 플레이리스트 제목 */}
            <Skeleton className="h-7 w-1/2" /> {/* 플레이리스트 게시자 */}
          </div>
        </div>
        {/* 다음 플레이리스트 카드 */}
        <div className="absolute top-80 h-full w-full space-y-5 p-[30px]">
          <Skeleton className="bg-c800 aspect-video w-full rounded-xl" />{' '}
          {/* 플레이리스트 썸네일 */}
          <Skeleton className="bg-c800 h-9 w-3/4" /> {/* 플레이리스트 제목 */}
        </div>
      </div>
    </>
  )
}

export default HomePageSkeleton
