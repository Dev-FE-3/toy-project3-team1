import { useMemo } from 'react'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { PlaylistCardProps } from '@/pages/Home/model/types'
import CarouselView from './CarouselView'
import HashTag from '@/shared/components/HashTag/HashTag'
import { cn } from '@/shared/model/lib/utils'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
import { usePlaylistLike } from '@/shared/hooks/usePlaylistLike'
import { usePlaylistBookmark } from '@/shared/hooks/usePlaylistBookmark'

const PlaylistCard = ({ playlist, carouselRef, isBackground, videoItems }: PlaylistCardProps) => {
  const { isLiked, likeCount, toggleLike, likeLoading } = usePlaylistLike(playlist.id)
  const { isBookmarked, bookmarkCount, toggleBookmark, bookmarkLoading } = usePlaylistBookmark(
    playlist.id,
  )
  const playlistVideoItems = useMemo(() => {
    return videoItems.filter((item) => item.playlist_id === playlist.id)
  }, [videoItems, playlist.id])

  const carouselImages = useMemo((): string[] => {
    const thumbnailUrl = playlist.thumbnail_url
    const videoThumbnails = playlistVideoItems.map((item) => item.thumbnail_url)
    if (thumbnailUrl === videoThumbnails[0]) return [...videoThumbnails]
    return [thumbnailUrl, ...videoThumbnails]
  }, [playlist.thumbnail_url, videoItems])

  const uploadedDate = getRelativeTime(playlist.created_at)

  return (
    <div
      className={cn(
        'relative py-3',
        isBackground
          ? 'bg-c900 border-none'
          : 'from-c600 to-c800 border-c500 border-y-1 bg-gradient-to-b',
      )}
    >
      <CarouselView
        images={carouselImages}
        title={playlist.title}
        carouselRef={carouselRef}
        isBackground={isBackground}
      />

      <div className={cn('relative left-0 w-full py-2 pr-4 pb-4 pl-5', { 'px-4': isBackground })}>
        <div className="flex w-full justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-c50 text-h4 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
              {playlist.title}
            </h2>
            <div className={cn('flex items-center gap-4', { 'opacity-0': isBackground })}>
              <UserCard
                nickname={playlist.profiles.nickname}
                profileId={playlist.profile_id}
                size="small"
              />
              <p className="text-textR text-c500">{uploadedDate}</p>
            </div>
          </div>

          <div className={cn('mt-1 flex', { 'opacity-0': isBackground })}>
            <button
              type="button"
              onClick={toggleLike}
              disabled={likeLoading}
              className="flex flex-col items-center gap-1 px-1"
            >
              <LikeIcon isLiked={isLiked} size={34} />
              <span className="text-c400 text-captionM">{likeCount}</span>
            </button>

            <button
              type="button"
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className="flex flex-col items-center gap-1 pl-1"
            >
              <BookmarkIcon isBookmarked={isBookmarked} size={34} />
              <span className="text-c400 text-captionM">{bookmarkCount}</span>
            </button>
          </div>
        </div>

        <div className={cn('mt-5 flex gap-[10px]', { 'opacity-0': isBackground })}>
          {playlist.hashtag?.map((tagName, index) => <HashTag key={index} tag={tagName} />)}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard
