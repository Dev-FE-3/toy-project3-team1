import { useState } from 'react'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { PlaylistCardProps } from '@/features/Home/types'
import CarouselView from './CarouselView'
import HashTag from '@/shared/components/HashTag/HashTag'
import { cn } from '@/shared/model/lib/utils'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
import EmptyPlaylistCard from './EmptyPlaylistCard'

// PlaylistCard 컴포넌트 수정
const PlaylistCard = ({ playlist, carouselRef, isBackground }: PlaylistCardProps) => {
  if (!playlist) return <EmptyPlaylistCard />

  const isCarousel = Array.isArray(playlist.imageUrl)
  const [likes, setLikes] = useState(playlist.likes)
  const [bookmarks, setBookmarks] = useState(playlist.bookmarks)
  const [isLiked, setIsLiked] = useState(playlist.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(playlist.isBookmarked)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLikes((prev) => prev + (isLiked ? -1 : 1))
    setIsLiked((prev) => !prev)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarks((prev) => prev + (isBookmarked ? -1 : 1))
    setIsBookmarked((prev) => !prev)
  }

  const uploadedDate = getRelativeTime(playlist.uploadedDate)
  return (
    <div className="relative h-[440px] py-4">
      {isCarousel ? (
        <CarouselView
          images={playlist.imageUrl as string[]}
          title={playlist.title}
          carouselRef={carouselRef}
          isBackground={isBackground}
        />
      ) : null}

      <div className={cn('absolute left-0 w-full px-[38px] py-2', isBackground && 'px-4')}>
        <div className="flex w-full justify-between">
          <div className="flex w-72 flex-col gap-4">
            <h3 className="text-c50 text-h3 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
              {playlist.title}
            </h3>
            <div className={cn('flex items-center gap-4', isBackground && 'opacity-0')}>
              <UserCard name={playlist.user.name} imageUrl={playlist.user.imageUrl} />
              <p className="text-textR text-c500">{uploadedDate}</p>
            </div>
          </div>

          <div className={cn('mt-1 mr-1 flex', isBackground && 'opacity-0')}>
            <button
              type="button"
              onClick={handleLike}
              className="flex flex-col items-center gap-1 px-2"
            >
              <LikeIcon isLiked={isLiked} size={34} />
              <span className="text-c400 text-captionM">{likes.toLocaleString()}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1 px-2"
            >
              <BookmarkIcon isBookmarked={isBookmarked} size={34} />
              <span className="text-c400 text-captionM">{bookmarks.toLocaleString()}</span>
            </button>
          </div>
        </div>

        <div className={cn('mt-5 flex gap-[10px]', isBackground && 'opacity-0')}>
          {playlist.tag.map((tagName, index) => (
            <HashTag key={index} tag={tagName} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard
