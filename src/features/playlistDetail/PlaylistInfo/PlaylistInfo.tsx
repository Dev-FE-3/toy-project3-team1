import { Button } from '@/shared/components/ui/button'
import { PenBox } from 'lucide-react'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
interface VideoInfoProps {
  title?: string
  description?: string
  isOwner: boolean
  isPublic: boolean
  videoCount?: number
  createdAt?: string
}

export default function PlaylistInfo({
  title,
  description,
  isOwner,
  createdAt,
  isPublic,
  videoCount,
}: VideoInfoProps) {
  return (
    <article className="mt-3">
      <header className="text-c400 flex text-sm">
        {/* 플레이리스트 공개 여부 */}
        <div className="flex items-center">
          <span>{isPublic ? '공개' : '비공개'}</span>
          <span className="mx-2">•</span>
        </div>
        {/* 플레이리스트 동영상 개수 */}
        <div className="flex items-center">
          <span>{videoCount}개의 동영상</span>
          <span className="mx-2">•</span>
        </div>
        {/* <div className="flex items-center">
          <span>조회수 20</span>
          <span className="mx-2">•</span>
        </div> */}
        {/* 플레이리스트 생성일 */}
        <div className="flex items-center">
          {createdAt && <span>{getRelativeTime(createdAt)}</span>}
        </div>
      </header>

      <section>
        <div className="flex justify-between">
          {/* 플레이리스트 제목 */}
          <h1 className="text-c100 mt-3 text-xl font-medium">{title || ''}</h1>
          {/* 플레이리스트 수정 버튼 */}
          <Button className="cursor-pointer items-end !p-0 align-bottom">
            {isOwner && <PenBox className="text-c300 !h-6 !w-6" />}
          </Button>
        </div>
        {/* 플레이리스트 설명 */}
        <p className="text-c300 mt-2">{description || ''}</p>
      </section>
    </article>
  )
}
