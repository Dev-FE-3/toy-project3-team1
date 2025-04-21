import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlaylistCard from '../PlaylistCard/PlaylistCard'
import { PlaylistViewProps } from '../../model/types'
import { usePrevious } from '../../hooks/usePrevious'
import { cn } from '@/shared/model/lib/utils'

export const PlaylistView = ({
  videoItems,
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
        ? 'Down' // 아래로 스와이프
        : 'Up' // 위로 스와이프
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

  const backgroundPlaylists = playlists
    .map((playlist, index) => ({ playlist, index }))
    .filter(({ index }) => index !== focusedIndex && Math.abs(index - focusedIndex) === 1)

  return (
    <>
      {/* Background Cards */}
      {backgroundPlaylists.length > 0 && (
        <AnimatePresence>
          {backgroundPlaylists.map(({ playlist, index }) => {
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
                key={`index-${index}`}
                className="pointer-events-none absolute inset-0 z-0 w-full origin-center"
                initial={{
                  opacity: 0,
                  y:
                    previousFocusedIndex === undefined
                      ? 0
                      : direction === 'Down'
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
                <PlaylistCard
                  videoItems={videoItems}
                  playlist={playlist}
                  carouselRef={carouselRef}
                  isBackground={true}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}

      {/* Focused Card */}
      <AnimatePresence>
        <motion.div
          key={`focused-${focusedIndex}`}
          className={cn(
            'absolute inset-0 top-4 z-20 w-full origin-center cursor-pointer py-2',
            playlists[focusedIndex],
            // ? 'from-c600 to-c800 border-c500 border-y-1 bg-gradient-to-b'
            // : 'bg-c900 border-none',
          )}
          onClick={handlePlaylistClick}
          initial={{
            opacity: previousFocusedIndex === undefined ? 1 : 0,
            y: previousFocusedIndex === undefined ? 0 : direction === 'Down' ? '60%' : '-60%',
            // 빈 플레이리스트일 때는 scale 애니메이션 제거
            scale: playlists[focusedIndex] ? 0.95 : 1,
          }}
          animate={{
            opacity: 1,
            y: 0,
            // 빈 플레이리스트일 때는 scale 애니메이션 제거
            scale: playlists[focusedIndex] ? [0.95, 1.02, 1] : 1,
          }}
          exit={{
            opacity: 0,
            y: direction === 'Down' ? '-60%' : '60%',
            scale: playlists[focusedIndex] ? 0.95 : 1,
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <PlaylistCard
            videoItems={videoItems}
            playlist={playlists[focusedIndex]}
            carouselRef={carouselRef}
            isBackground={false}
          />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
