import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
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
      <div className="text-c400 flex justify-center gap-1 text-xs">
        {/* 비디오 제목 */}
        <h3 className="text-c50 line-clamp-2 text-sm font-medium">{title}</h3>
        {/* 조회수 */}
        <span>{viewCount}</span>
        <span>•</span>
        {/* 업로드 일자 */}
        <span>{getRelativeTime(created_at)}</span>
      </div>
    </div>
  )
}
