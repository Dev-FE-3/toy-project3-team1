import { Skeleton } from '@/shared/components/ui/skeleton'

const ProfilePageSkeleton = () => {
  return (
    <div className="bg-c900 flex h-full flex-col space-y-8 overflow-hidden px-[20px] pt-[20px]">
      {/* 프로필 헤더 스켈레톤 */}
      <div className="flex gap-4">
        <Skeleton className="h-[80px] w-[80px] rounded-full" /> {/* 프로필 이미지 */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-40 rounded-md" /> {/* 닉네임 */}
          <Skeleton className="h-6 w-20 rounded-md" /> {/* 리스트 */}
        </div>
      </div>

      {/* 플레이리스트 목록 스켈레톤 */}
      <div className="grid-row-3 grid h-150 gap-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full rounded-lg" /> {/* 썸네일 */}
            <Skeleton className="h-4 w-3/4 rounded-md" /> {/* 제목 */}
            <Skeleton className="h-4 w-1/2 rounded-md" /> {/* 해시태그 등 */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfilePageSkeleton
