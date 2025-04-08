import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Categories } from '@/features/Home/components/Categories/Categories'
import { ensureValidCount } from '@/features/Home/types'
import { userFavoriteGames } from '@/features/Home/constants'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import playlists, { Playlist } from '@/features/Home/Playlist'
import { useNavigate } from 'react-router-dom'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'

const HomePage = () => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const gameCount = ensureValidCount(Object.keys(userFavoriteGames).length)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down'>('up')

  const handleDragStart = (e: React.PointerEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const deltaX = dragStart.x - e.clientX
    const deltaY = dragStart.y - e.clientY
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      if (isHorizontal && carouselRef.current) {
        handleHorizontalSwipe(deltaX)
      } else {
        handleVerticalSwipe(deltaY)
      }
      setIsDragging(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handleDragEnd = (e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleHorizontalSwipe = (delta: number) => {
    const imageUrls = playlists[focusedIndex].imageUrl
    if (!Array.isArray(imageUrls)) return

    if (delta > 0 && currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    } else if (delta < 0 && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  const handleVerticalSwipe = (delta: number) => {
    if (delta > 0 && focusedIndex < playlists.length - 1) {
      setSwipeDirection('up')
      setFocusedIndex((prev) => prev + 1)
      setCurrentImageIndex(0)
    } else if (delta < 0 && focusedIndex > 0) {
      setSwipeDirection('down')
      setFocusedIndex((prev) => prev - 1)
      setCurrentImageIndex(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.touches[0].clientY
    const diff = touchStart - currentTouch

    if (Math.abs(diff) > 50) {
      if (diff > 0 && focusedIndex < playlists.length - 1) {
        setSwipeDirection('up')
        setFocusedIndex((prev) => prev + 1)
        setCurrentImageIndex(0)
      } else if (diff < 0 && focusedIndex > 0) {
        setSwipeDirection('down')
        setFocusedIndex((prev) => prev - 1)
        setCurrentImageIndex(0)
      }
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY

    if (delta > 0 && focusedIndex < playlists.length - 1) {
      setSwipeDirection('up')
      setFocusedIndex((prev) => prev + 1)
      setCurrentImageIndex(0)
    } else if (delta < 0 && focusedIndex > 0) {
      setSwipeDirection('down')
      setFocusedIndex((prev) => prev - 1)
      setCurrentImageIndex(0)
    }
  }

  return (
    <>
      <Categories count={gameCount} />
      <div
        ref={containerRef}
        className="bg-c900 relative mx-auto h-[calc(100%-98px)] max-w-[480px] touch-pan-y overflow-hidden"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Background Playlists */}
        {playlists.map((playlist, index) => {
          if (index === focusedIndex) return null
          if (index < focusedIndex - 1 || index > focusedIndex + 1) return null

          return (
            <motion.div
              key={`background-${playlist.id}`}
              className="bg-c900 pointer-events-none absolute inset-0 w-full origin-center"
              initial={false}
              animate={{
                scale: 0.95,
                y: index > focusedIndex ? '35%' : '-35%',
                opacity: 0.6,
                filter: 'blur(1px)',
                z: -50,
              }}
              transition={{
                duration: 0.4,
                ease: [0.32, 0.72, 0, 1], // custom easing
                opacity: { duration: 0.3 },
              }}
            >
              <PlaylistCard playlist={playlist} currentImageIndex={0} carouselRef={carouselRef} />
            </motion.div>
          )
        })}

        {/* Focused Playlist */}
        <AnimatePresence mode="wait">
          <motion.div
            key={focusedIndex}
            className="bg-c500 absolute inset-0 h-[440px] w-full origin-center"
            initial={{
              opacity: 0.6,
              scale: 0.95,
              y: swipeDirection === 'up' ? '35%' : '-35%',
              z: -50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              z: 0,
            }}
            exit={{
              opacity: 0.6,
              scale: 0.95,
              y: swipeDirection === 'up' ? '-35%' : '35%',
              z: -50,
            }}
            transition={{
              duration: 0.4,
              ease: [0.32, 0.72, 0, 1], // custom easing
              opacity: { duration: 0.3 },
            }}
          >
            <PlaylistCard
              playlist={playlists[focusedIndex]}
              currentImageIndex={currentImageIndex}
              carouselRef={carouselRef}
              setCurrentImageIndex={setCurrentImageIndex} // 추가
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

interface PlaylistCardProps {
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

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`, {
      state: {
        playlist,
      },
    })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation() // 부모의 onClick 이벤트 전파 방지
    setLikes((prev) => prev + (isLiked ? -1 : 1))
    setIsLiked((prev) => !prev)
    // TODO: API call to update likes
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarks((prev) => prev + (isBookmarked ? -1 : 1))
    setIsBookmarked((prev) => !prev)
    // TODO: API call to update bookmarks
  }

  return (
    <div className="relative h-[440px] cursor-pointer" onClick={handleClick}>
      {isCarousel ? (
        <CarouselView
          images={playlist.imageUrl as string[]}
          title={playlist.title}
          currentIndex={currentImageIndex}
          carouselRef={carouselRef}
          setCurrentImageIndex={setCurrentImageIndex} // 추가
        />
      ) : (
        '' // <SingleImageView image={playlist.imageUrl as string} title={playlist.title} />
      )}

      <div className="absolute bottom-0 left-0 w-full space-y-2 bg-gradient-to-t from-black/80 p-6">
        <UserCard name={playlist.user.name} imageUrl={playlist.user.imageUrl} className="mb-2" />
        <h2 className="text-c50 text-xl font-bold">{playlist.title}</h2>
        <p className="text-c200 text-sm">{playlist.description}</p>

        {/* Interaction buttons */}
        <div className="mt-4 flex items-center gap-6">
          <button
            onClick={handleLike}
            className="bg-c900 flex items-center gap-2 transition-all hover:scale-105"
          >
            <LikeIcon isLiked={isLiked} />
            <span className="text-c500 text-sm">{likes.toLocaleString()}</span>
          </button>

          <button
            onClick={handleBookmark}
            className="bg-c900 flex items-center gap-2 transition-all hover:scale-105"
          >
            <BookmarkIcon isBookmarked={isBookmarked} />
            <span className="text-c500 text-sm">{bookmarks.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface CarouselViewProps {
  images: string[]
  title: string
  currentIndex: number
  carouselRef: React.RefObject<HTMLDivElement>
  setCurrentImageIndex: (index: number) => void // 추가
}

const CarouselView = ({
  images,
  title,
  currentIndex,
  carouselRef,
  setCurrentImageIndex, // 추가
}: CarouselViewProps) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const itemWidth = container.offsetWidth
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  return (
    <div className="relative w-full overflow-visible">
      <div
        ref={carouselRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto"
        style={{
          marginLeft: '-20px',
          marginRight: '-20px',
          paddingLeft: '50px',
          paddingRight: '100px',
          width: 'calc(100% + 40px)',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={handleScroll}
      >
        {images.map((url, imgIndex) => (
          <div key={imgIndex} className="relative w-[400px] flex-none snap-center px-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <motion.div
                className="h-full w-full"
                animate={{
                  opacity: imgIndex === currentIndex ? 1 : 0.4,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src={url}
                  alt={`${title} ${imgIndex + 1}`}
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// SingleImageView도 같은 비율로 수정
// const SingleImageView = ({ image, title }: SingleImageViewProps) => (
//   <div className="relative mx-auto w-[320px]">
//     <div className="aspect-video w-full overflow-hidden rounded-lg">
//       <img
//         src={image}
//         alt={title}
//         className="h-full w-full object-cover object-center"
//         draggable={false}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
//     </div>
//   </div>
// )

// interface ImageIndicatorProps {
//   total: number
//   current: number
// }

// const ImageIndicator = ({ total, current }: ImageIndicatorProps) => (
//   <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
//     {Array.from({ length: total }).map((_, index) => (
//       <div
//         key={index}
//         className={`h-2 w-2 rounded-full transition-all ${
//           index === current ? 'bg-c50 scale-125' : 'bg-c50/50'
//         }`}
//       />
//     ))}
//   </div>
// )

export default HomePage
