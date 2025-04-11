import { useCallback, useState } from 'react'
import { SwipeDirection } from '../model/types'

interface ScrollControlProps {
  focusedIndex: number
  isScrolling: boolean
  playlistLength: number
  swipeDirection: SwipeDirection
  setIsScrolling: (value: boolean) => void
  setFocusedIndex: (value: (prev: number) => number) => void
  setCurrentImageIndex: (value: number) => void
  setSwipeDirection: React.Dispatch<React.SetStateAction<SwipeDirection>>
}

export const useScrollControl = ({
  focusedIndex,
  isScrolling,
  playlistLength,
  swipeDirection,
  setIsScrolling,
  setFocusedIndex,
  setCurrentImageIndex,
  setSwipeDirection,
}: ScrollControlProps) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrolling) return
      setIsScrolling(true)

      const delta = e.deltaY
      const scrollThreshold = 50

      if (Math.abs(delta) > scrollThreshold) {
        if (delta > 0 && focusedIndex < playlistLength - 1) {
          if (swipeDirection !== 'up') setSwipeDirection('up')
          setFocusedIndex((prev) => prev + 1)
          setCurrentImageIndex(0)
        } else if (delta < 0 && focusedIndex > 0) {
          if (swipeDirection !== 'down') setSwipeDirection('down')
          setFocusedIndex((prev) => prev - 1)
          setCurrentImageIndex(0)
        }
      }

      setTimeout(() => {
        setIsScrolling(false)
      }, 500)
    },
    [
      focusedIndex,
      isScrolling,
      playlistLength,
      swipeDirection,
      setIsScrolling,
      setFocusedIndex,
      setCurrentImageIndex,
      setSwipeDirection,
    ],
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY === null || isScrolling) return

      const touchEndY = e.touches[0].clientY
      const delta = touchStartY - touchEndY
      const scrollThreshold = 130

      if (Math.abs(delta) > scrollThreshold) {
        setIsScrolling(true)

        if (delta > 0 && focusedIndex < playlistLength - 1) {
          if (swipeDirection !== 'up') setSwipeDirection('up')
          setFocusedIndex((prev) => prev + 1)
          setCurrentImageIndex(0)
        } else if (delta < 0 && focusedIndex > 0) {
          if (swipeDirection !== 'down') setSwipeDirection('down')
          setFocusedIndex((prev) => prev - 1)
          setCurrentImageIndex(0)
        }

        setTimeout(() => {
          setIsScrolling(false)
        }, 300)

        setTouchStartY(null)
      }
    },
    [
      focusedIndex,
      isScrolling,
      playlistLength,
      swipeDirection,
      touchStartY,
      setIsScrolling,
      setFocusedIndex,
      setCurrentImageIndex,
      setSwipeDirection,
    ],
  )

  const handleTouchEnd = useCallback(() => {
    setTouchStartY(null)
  }, [])

  return {
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
