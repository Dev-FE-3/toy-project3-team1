import { useState, useCallback } from 'react'

export const usePlaylistControl = (playlistLength: number) => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const setFocusedIndexWithBounds = useCallback(
    (value: number | ((prev: number) => number)) => {
      setFocusedIndex((prev) => {
        const nextIndex = typeof value === 'function' ? value(prev) : value
        return Math.max(0, Math.min(nextIndex, playlistLength - 1))
      })
    },
    [playlistLength],
  )

  return {
    focusedIndex,
    currentImageIndex,
    isScrolling,
    setIsScrolling,
    setCurrentImageIndex,
    setFocusedIndex: setFocusedIndexWithBounds,
  }
}
