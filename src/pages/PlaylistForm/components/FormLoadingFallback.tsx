import { Skeleton } from '@/shared/components/ui/skeleton'

export const FormLoadingFallback = () => (
  <div className="container mx-auto px-9">
    <div className="mb-8">
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-1/2" />
    </div>
  </div>
)

export default FormLoadingFallback
