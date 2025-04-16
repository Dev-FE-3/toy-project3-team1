import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PlaylistView } from './PlaylistView/PlaylistView'
import { usePlaylistControl } from '../hooks/usePlaylistControl'
import { useScrollControl } from '../hooks/useScrollControl'
import { PlaylistContainerProps } from '../model/types'

export const PlaylistContainer = ({ playlists }: PlaylistContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
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

  const { handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd } = useScrollControl({
    focusedIndex,
    isScrolling,
    playlistLength: playlists.length,
    swipeDirection,
    setIsScrolling,
    setFocusedIndex,
    setCurrentImageIndex,
    setSwipeDirection,
  })

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-full w-full overflow-hidden"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      <div className="from-c900 pointer-events-none absolute top-0 z-10 h-[24vh] w-full bg-gradient-to-b via-transparent to-transparent" />
      <div className="from-c900 pointer-events-none absolute bottom-0 z-10 h-[24vh] w-full bg-gradient-to-t via-transparent to-transparent" />
    </div>
  )
}
