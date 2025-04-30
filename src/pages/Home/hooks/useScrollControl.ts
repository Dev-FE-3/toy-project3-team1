import { useCallback, useState } from 'react'
import { SwipeDirection } from '../model/types'
import {
  TOUCH_SCROLL_THRESHOLD,
  TOUCH_TIMEOUT,
  WHEEL_SCROLL_THRESHOLD,
  WHEEL_TIMEOUT,
} from '../constants/animation'

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

      if (Math.abs(delta) > WHEEL_SCROLL_THRESHOLD) {
        if (delta > 0 && focusedIndex < playlistLength - 1) {
          if (swipeDirection !== 'Up') setSwipeDirection('Up')
          setFocusedIndex((prev) => prev + 1)
          setCurrentImageIndex(0)
        } else if (delta < 0 && focusedIndex > 0) {
          if (swipeDirection !== 'Down') setSwipeDirection('Down')
          setFocusedIndex((prev) => prev - 1)
          setCurrentImageIndex(0)
        }
      }

      setTimeout(() => {
        setIsScrolling(false)
      }, WHEEL_TIMEOUT)
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

      if (Math.abs(delta) > TOUCH_SCROLL_THRESHOLD) {
        setIsScrolling(true)

        if (delta > 0 && focusedIndex < playlistLength - 1) {
          if (swipeDirection !== 'Up') setSwipeDirection('Up')
          setFocusedIndex((prev) => prev + 1)
          setCurrentImageIndex(0)
        } else if (delta < 0 && focusedIndex > 0) {
          if (swipeDirection !== 'Down') setSwipeDirection('Down')
          setFocusedIndex((prev) => prev - 1)
          setCurrentImageIndex(0)
        }

        setTimeout(() => {
          setIsScrolling(false)
        }, TOUCH_TIMEOUT)

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
