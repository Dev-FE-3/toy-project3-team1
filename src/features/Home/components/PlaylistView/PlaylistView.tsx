import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlaylistCard from '../PlaylistCard/PlaylistCard'
import { PlaylistViewProps } from '../../types'
import { usePrevious } from '../../hooks/usePrevious'

export const PlaylistView = ({
  playlists,
  focusedIndex,
  currentImageIndex,
  carouselRef,
}: PlaylistViewProps) => {
  const navigate = useNavigate()
  const previousFocusedIndex = usePrevious(focusedIndex)
  const direction =
    previousFocusedIndex === undefined
      ? 0
      : focusedIndex > previousFocusedIndex
        ? 1 // 아래로 스와이프
        : -1 // 위로 스와이프
  const handlePlaylistClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
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
      {/* Background Cards */}
      <AnimatePresence>
        {playlists.map((playlist, index) => {
          const isBackground = index !== focusedIndex && Math.abs(index - focusedIndex) === 1

          if (!isBackground) return null

          const offsetY = (index: number) => {
            if (index > focusedIndex) return '53%' // 아래 카드
            if (index < focusedIndex) return '-20%' // 위 카드
            return '0%'
          }

          const exitY = (index: number) => {
            if (previousFocusedIndex === undefined) return '0%'

            if (index === previousFocusedIndex) {
              // 포커스 카드 → 사라지는 방향
              return focusedIndex > previousFocusedIndex ? '-60%' : '60%'
            }

            if (index > previousFocusedIndex) {
              // 아래 카드
              return focusedIndex > previousFocusedIndex ? '-30%' : '60%'
            }

            if (index < previousFocusedIndex) {
              // 위 카드
              return focusedIndex > previousFocusedIndex ? '-60%' : '30%'
            }

            return '0%'
          }
          return (
            <motion.div
              key={`bg-${playlist.id ?? `index-${index}`}`}
              className="pointer-events-none absolute inset-0 z-0 w-full origin-center"
              initial={{
                opacity: 0,
                y:
                  previousFocusedIndex === undefined
                    ? 0
                    : direction === 1
                      ? '60%' // 아래에서 올라옴
                      : '-60%', // 위에서 내려옴
                scale: 0.9,
              }}
              animate={{
                opacity: 0.5,
                y: offsetY(index),
                scale: 0.95,
              }}
              exit={{
                opacity: 0,
                y: exitY(index),
                scale: 0.9,
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.8, 0.25, 1],
              }}
            >
              <PlaylistCard playlist={playlist} carouselRef={carouselRef} isBackground={true} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Focused Card */}
      <AnimatePresence>
        <motion.div
          key={`focused-${focusedIndex}`}
          className="bg-c600 from-c800 absolute inset-0 top-10 z-20 h-[440px] w-full origin-center cursor-pointer bg-gradient-to-t"
          onClick={handlePlaylistClick}
          initial={{
            opacity: previousFocusedIndex === undefined ? 1 : 0,
            y:
              previousFocusedIndex === undefined
                ? 0
                : direction === 1
                  ? '60%' // 아래에서 올라옴
                  : '-60%', // 위에서 내려옴
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [0.95, 1.02, 1],
          }}
          exit={{
            opacity: 0,
            y: direction === 1 ? '-60%' : '60%',
            scale: 0.95,
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <PlaylistCard
            playlist={playlists[focusedIndex]}
            carouselRef={carouselRef}
            isBackground={false}
          />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
