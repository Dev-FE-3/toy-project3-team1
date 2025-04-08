import { useState } from 'react'

export const usePlaylistControl = (totalPlaylists: number) => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down'>('up')
  const [isScrolling, setIsScrolling] = useState(false)

  const handlePlaylistChange = (delta: number) => {
    if (delta > 0 && focusedIndex < totalPlaylists - 1) {
      setSwipeDirection('up')
      setFocusedIndex((prev) => prev + 1)
      setCurrentImageIndex(0)
    } else if (delta < 0 && focusedIndex > 0) {
      setSwipeDirection('down')
      setFocusedIndex((prev) => prev - 1)
      setCurrentImageIndex(0)
    }
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
    setSwipeDirection, // 명시적으로 반환
  }
}
