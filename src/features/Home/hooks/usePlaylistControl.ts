import { useState } from 'react'

export const usePlaylistControl = (totalPlaylists: number) => {
  const [focusedIndex, setFocusedIndexRaw] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down'>('up')
  const [isScrolling, setIsScrolling] = useState(false)

  const setFocusedIndex = (updater: number | ((prev: number) => number)) => {
    setFocusedIndexRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (next < 0 || next >= totalPlaylists) return prev
      return next
    })
  }

  const handlePlaylistChange = (delta: number) => {
    setFocusedIndex((prev) => {
      const next = delta > 0 ? prev + 1 : prev - 1

      if (next >= 0 && next < totalPlaylists) {
        setSwipeDirection(delta > 0 ? 'up' : 'down')
        setCurrentImageIndex(0)
        return next
      }

      return prev
    })
  }

  return {
    focusedIndex,
    currentImageIndex,
    swipeDirection,
    isScrolling,
    setIsScrolling,
    setCurrentImageIndex,
    handlePlaylistChange,
    setFocusedIndex,
    setSwipeDirection,
  }
}
