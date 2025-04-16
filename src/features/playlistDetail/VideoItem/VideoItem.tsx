import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { countFormatter } from '@/pages/PlaylistDetail/utils/countFormatter'

interface VideoItemProps {
  channelTitle: string
  title: string
  thumbnail_url: string
  viewCount: string
  likeCount: string
  // created_at: string
  onClick?: () => void
}

export default function VideoItem({
  channelTitle,
  title,
  thumbnail_url,
  viewCount,
  likeCount,
  // created_at,
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
      <div className="flex flex-1 flex-col">
        {/* 비디오 제목 */}
        <h3 className="text-c50 mb-1 line-clamp-2 text-sm font-medium">{title}</h3>
        {/* 채널 정보 및 통계 */}
        <div className="text-c400 flex flex-col gap-0.5 text-xs">
          <span>{channelTitle}</span>
          <div className="flex items-center gap-1">
            <span>좋아요 {countFormatter({ count: likeCount })}</span>
            <span>•</span>
            <span>조회수 {countFormatter({ count: viewCount })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
