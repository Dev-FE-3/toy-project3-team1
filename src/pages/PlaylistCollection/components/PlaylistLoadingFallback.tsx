import { Skeleton } from '@/shared/components/ui/skeleton'

export const PlaylistLoadingFallback = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="h-[200px] w-full" />
    ))}
  </div>
)

export default PlaylistLoadingFallback
