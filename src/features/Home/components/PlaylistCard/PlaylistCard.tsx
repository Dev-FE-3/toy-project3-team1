import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { Playlist } from '@/features/Home/types'
import CarouselView from './CarouselView'

// ... PlaylistCard component code ...
export interface PlaylistCardProps {
  playlist: Playlist
  currentImageIndex: number
  carouselRef: React.RefObject<HTMLDivElement>
  setCurrentImageIndex: (index: number) => void // 추가
}

// PlaylistCard 컴포넌트 수정
const PlaylistCard = ({
  playlist,
  currentImageIndex,
  carouselRef,
  setCurrentImageIndex,
}: PlaylistCardProps) => {
  const navigate = useNavigate()
  const isCarousel = Array.isArray(playlist.imageUrl)
  const [likes, setLikes] = useState(playlist.likes)
  const [bookmarks, setBookmarks] = useState(playlist.bookmarks)
  const [isLiked, setIsLiked] = useState(playlist.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(playlist.isBookmarked)

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시 네비게이션 방지
    if ((e.target as HTMLElement).closest('button')) {
      return
    }

    navigate(`/playlist/${playlist.id}`, {
      state: {
        playlist,
        currentImageIndex,
      },
    })
  }

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
    <div className="relative h-[440px]" onClick={handleCardClick}>
      {isCarousel ? (
        <CarouselView
          images={playlist.imageUrl as string[]}
          title={playlist.title}
          currentIndex={currentImageIndex}
          carouselRef={carouselRef}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      ) : null}

      <div className="absolute bottom-0 left-0 w-full space-y-2 bg-gradient-to-t from-black/80 p-6">
        <UserCard name={playlist.user.name} imageUrl={playlist.user.imageUrl} className="mb-2" />
        <h2 className="text-c50 text-xl font-bold">{playlist.title}</h2>
        <p className="text-c200 text-sm">{playlist.description}</p>

        <div className="mt-4 flex items-center gap-6">
          <button
            type="button"
            onClick={handleLike}
            className="bg-c900/50 hover:bg-c900 z-10 flex items-center gap-2 rounded-lg px-3 py-2 transition-all active:scale-95"
          >
            <LikeIcon isLiked={isLiked} />
            <span className="text-c50 text-sm font-medium">{likes.toLocaleString()}</span>
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            className="bg-c900/50 hover:bg-c900 z-10 flex items-center gap-2 rounded-lg px-3 py-2 transition-all active:scale-95"
          >
            <BookmarkIcon isBookmarked={isBookmarked} />
            <span className="text-c50 text-sm font-medium">{bookmarks.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard
