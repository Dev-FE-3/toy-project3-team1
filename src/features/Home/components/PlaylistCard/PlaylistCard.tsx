import { useState } from 'react'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { PlaylistCardProps } from '@/features/Home/types'
import CarouselView from './CarouselView'
import HashTag from '@/shared/components/HashTag/HashTag'
import { cn } from '@/shared/model/lib/utils'

// PlaylistCard 컴포넌트 수정
const PlaylistCard = ({ playlist, carouselRef, isBackground }: PlaylistCardProps) => {
  if (!playlist) return null
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
  return (
    <div className="relative h-[440px]">
      {isCarousel ? (
        <CarouselView
          images={playlist.imageUrl as string[]}
          title={playlist.title}
          carouselRef={carouselRef}
          isBackground={isBackground}
        />
      ) : null}

      <div className="absolute left-0 w-full px-[38px] py-5">
        <div className="flex justify-between">
          <h3 className="text-c50 text-h3">{playlist.title}</h3>
          <div className={cn('flex', isBackground && 'opacity-0')}>
            <button
              type="button"
              onClick={handleLike}
              className="flex flex-col items-center gap-1 px-2"
            >
              <LikeIcon isLiked={isLiked} size={29} />
              <span className="text-c400 text-captionM">{likes.toLocaleString()}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1 px-2"
            >
              <BookmarkIcon isBookmarked={isBookmarked} size={29} />
              <span className="text-c400 text-captionM">{bookmarks.toLocaleString()}</span>
            </button>
          </div>
        </div>

        <div className={cn('flex gap-[10px]', isBackground && 'opacity-0')}>
          {playlist.tag.map((tagName, index) => (
            <HashTag key={index} tag={tagName} />
          ))}
        </div>

        <div className={cn(isBackground && 'opacity-0')}>
          <UserCard name={playlist.user.name} imageUrl={playlist.user.imageUrl} className="mt-5" />
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard
