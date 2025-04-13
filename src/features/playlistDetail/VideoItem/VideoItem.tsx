import { AspectRatio } from '@/shared/components/ui/aspect-ratio'

interface VideoItemProps {
  title: string
  thumbnail_url: string
  viewCount: string
  created_at: string
  onClick?: () => void
}

export default function VideoItem({
  title,
  thumbnail_url,
  viewCount,
  created_at,
  onClick,
}: VideoItemProps) {
  return (
    <div className="hover:bg-c800 flex cursor-pointer gap-3 rounded-lg p-2" onClick={onClick}>
      {/* 썸네일 */}
      <div className="relative w-32 flex-shrink-0">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
          <img src={thumbnail_url} alt={title} className="h-full w-full object-cover" />
        </AspectRatio>
      </div>

      {/* 비디오 정보 */}
      <div className="flex flex-col justify-center">
        <h3 className="line-clamp-2 text-sm font-medium text-white">{title}</h3>
        <div className="text-c400 mt-1 flex items-center gap-2 text-xs">
          <div className="flex items-center">
            <span>{viewCount}</span>
          </div>
          <span>•</span>
          <span>{created_at}</span>
        </div>
      </div>
    </div>
  )
}
