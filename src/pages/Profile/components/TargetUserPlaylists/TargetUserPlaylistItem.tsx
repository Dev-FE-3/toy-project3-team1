import { PlaylistWithItems } from '@/pages/Home/model/types'
import HashTag from '@/shared/components/HashTag/HashTag'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
import { Link } from 'react-router-dom'

const TargetUserPlaylistItem = ({ playlist }: { playlist: PlaylistWithItems }) => {
  return (
    <div key={playlist.id} className="mb-10">
      <Link to={`/playlist/${playlist.id}`}>
        {/* 플레이리스트 상세 페이지로 이동 */}
        <img
          src={playlist.thumbnail_url}
          alt={playlist.title}
          className="aspect-video w-full rounded-lg object-cover"
        />
        <h2 className="text-c50 text-h4 mt-3">{playlist.title}</h2>
        <div className="text-captionM text-c500 mt-2 flex gap-3">
          <span>좋아요 {playlist.like_count}개</span>
          <span>영상 {playlist.playlist_items?.length}개</span>
          <span>구독 {playlist.subscriber_count}명</span>
          <span>{getRelativeTime(playlist.created_at)}</span>
        </div>
        <p className="text-textR text-c400 mt-1">{playlist.description ?? '설명이 없습니다.'}</p>
        <div className="mt-3 flex gap-[10px]">
          {Array.isArray(playlist.hashtag) &&
            playlist.hashtag.map((tagName, index) => (
              <HashTag key={index} tag={tagName} size="small" />
            ))}
        </div>
      </Link>
    </div>
  )
}

export default TargetUserPlaylistItem
