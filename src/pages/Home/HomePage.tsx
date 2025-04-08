import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Categories } from '@/features/Home/components/Categories/Categories'
import { PlaylistView } from '@/features/Home/components/PlaylistView/PlaylistView'
import { usePlaylistControl } from '@/features/Home/hooks/usePlaylistControl'
import playlists from '@/features/Home/Playlist'
import { ensureValidCount } from '@/features/Home/types'
import { userFavoriteGames } from '@/features/Home/constants'

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const {
    focusedIndex,
    currentImageIndex,
    swipeDirection,
    isScrolling,
    setIsScrolling,
    setCurrentImageIndex,
    setFocusedIndex,
    setSwipeDirection,
  } = usePlaylistControl(playlists.length)

  const gameCount = ensureValidCount(Object.keys(userFavoriteGames).length)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrolling) return
      setIsScrolling(true)

      const delta = e.deltaY
      const scrollThreshold = 15 // 스크롤 감도 조절

      if (Math.abs(delta) > scrollThreshold) {
        if (delta > 0 && focusedIndex < playlists.length - 1) {
          // 아래로 스크롤
          if (swipeDirection !== 'up') setSwipeDirection('up') // 방향이 바뀌었을 때만 업데이트
          setFocusedIndex((prev) => prev + 1)
          setCurrentImageIndex(0)
        } else if (delta < 0 && focusedIndex > 0) {
          // 위로 스크롤
          if (swipeDirection !== 'down') setSwipeDirection('down') // 방향이 바뀌었을 때만 업데이트
          setFocusedIndex((prev) => prev - 1)
          setCurrentImageIndex(0)
        }
      }

      setTimeout(() => {
        setIsScrolling(false)
      }, 300)
    },
    [
      focusedIndex,
      isScrolling,
      playlists.length,
      swipeDirection,
      setCurrentImageIndex,
      setFocusedIndex,
      setSwipeDirection,
    ],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || isScrolling) return

    const touchEndY = e.touches[0].clientY
    const delta = touchStartY - touchEndY
    const scrollThreshold = 50 // 터치 스크롤 감도 조절

    if (Math.abs(delta) > scrollThreshold) {
      setIsScrolling(true)

      if (delta > 0 && focusedIndex < playlists.length - 1) {
        // 위로 스와이프
        if (swipeDirection !== 'up') setSwipeDirection('up') // 방향이 바뀌었을 때만 업데이트
        setFocusedIndex((prev) => prev + 1)
        setCurrentImageIndex(0)
      } else if (delta < 0 && focusedIndex > 0) {
        // 아래로 스와이프
        if (swipeDirection !== 'down') setSwipeDirection('down') // 방향이 바뀌었을 때만 업데이트
        setFocusedIndex((prev) => prev - 1)
        setCurrentImageIndex(0)
      }

      setTimeout(() => {
        setIsScrolling(false)
      }, 300)

      setTouchStartY(null) // 터치 시작 위치 초기화
    }
  }

  const handleTouchEnd = () => {
    setTouchStartY(null) // 터치 시작 위치 초기화
  }

  return (
    <>
      <Categories count={gameCount} />
      <div
        ref={containerRef}
        className="bg-c900 from-c900 relative mx-auto h-[calc(100%-98px)] max-w-[480px] overflow-hidden bg-gradient-to-b"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
        onWheel={handleWheel} // 휠 이벤트
        onTouchStart={handleTouchStart} // 터치 시작
        onTouchMove={handleTouchMove} // 터치 이동
        onTouchEnd={handleTouchEnd} // 터치 종료
      >
        <AnimatePresence mode="wait">
          <PlaylistView
            playlists={playlists}
            focusedIndex={focusedIndex}
            currentImageIndex={currentImageIndex}
            swipeDirection={swipeDirection}
            carouselRef={containerRef}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        </AnimatePresence>
      </div>
    </>
  )
}

export default HomePage
