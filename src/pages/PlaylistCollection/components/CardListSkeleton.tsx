import { CardSkeleton } from './CardSkeleton'

export function CardListSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  )
}
