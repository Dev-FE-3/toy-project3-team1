import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlaylistCard from '../PlaylistCard/PlaylistCard'
import { Playlist } from '../../types'

interface PlaylistViewProps {
  playlists: Playlist[]
  focusedIndex: number
  currentImageIndex: number
  swipeDirection: 'up' | 'down'
  carouselRef: React.RefObject<HTMLDivElement>
  setCurrentImageIndex: (index: number) => void
}

export const PlaylistView = ({
  playlists,
  focusedIndex,
  currentImageIndex,
  swipeDirection,
  carouselRef,
  setCurrentImageIndex,
}: PlaylistViewProps) => {
  const navigate = useNavigate()

  const handlePlaylistClick = (e: React.MouseEvent) => {
    // 버튼 클릭은 무시
    if ((e.target as HTMLElement).closest('button')) {
      return
    }

    const focusedPlaylist = playlists[focusedIndex]
    navigate(`/playlist/${focusedPlaylist.id}`, {
      state: {
        playlist: focusedPlaylist,
        currentImageIndex,
      },
    })
  }

  return (
    <>
      {/* Background Playlists */}
      {playlists.map((playlist, index) => {
        if (index === focusedIndex) return null
        if (index < focusedIndex - 1 || index > focusedIndex + 1) return null

        return (
          <motion.div
            key={`background-${playlist.id}`}
            className="pointer-events-none absolute inset-0 w-full origin-center"
            initial={{
              scale: 0.9,
              opacity: 0.5,
              z: index > focusedIndex ? -100 : -200,
            }}
            animate={{
              scale: 0.95,
              opacity: 0.6,
              z: index > focusedIndex ? -50 : -100,
              y: index > focusedIndex ? '30%' : '-30%',
            }}
            exit={{
              scale: 0.9,
              opacity: 0.5,
              z: index > focusedIndex ? -100 : -200,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.8, 0.25, 1], // 부드러운 애니메이션
            }}
          >
            <PlaylistCard
              playlist={playlist}
              currentImageIndex={0}
              carouselRef={carouselRef}
              setCurrentImageIndex={setCurrentImageIndex}
            />
          </motion.div>
        )
      })}

      {/* Focused Playlist */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focusedIndex}
          className="bg-c600 h-[440px] absolute inset-0 w-full origin-center cursor-pointer"
          onClick={handlePlaylistClick}
          initial={{
            scale: 0.95,
            opacity: 0.8,
            z: 0,
            y: swipeDirection === 'up' ? '30%' : '-30%',
          }}
          animate={{
            scale: 1,
            opacity: 1,
            z: 50,
            y: 0,
          }}
          exit={{
            scale: 0.95,
            opacity: 0.8,
            z: 0,
            y: swipeDirection === 'up' ? '-30%' : '30%',
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1], // 부드러운 애니메이션
          }}
        >
          <PlaylistCard
            playlist={playlists[focusedIndex]}
            currentImageIndex={currentImageIndex}
            carouselRef={carouselRef}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
