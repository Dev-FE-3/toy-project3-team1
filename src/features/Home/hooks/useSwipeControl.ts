import { useState } from 'react'

export const useSwipeControl = (handlePlaylistChange: (delta: number) => void) => {
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.PointerEvent) => {
    setDragStart(e.clientY)
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStart === null) return

    const currentY = e.clientY
    const deltaY = dragStart - currentY

    if (Math.abs(deltaY) > 50) {
      handlePlaylistChange(deltaY)
      setDragStart(null)
      setIsDragging(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handleDragEnd = (e: React.PointerEvent) => {
    setDragStart(null)
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isDragging,
  }
}
