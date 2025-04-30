import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  onIntersect: () => void
  enabled?: boolean
  threshold?: number
  rootMargin?: string
}

export const useInfiniteScroll = ({
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px',
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  const disconnectObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
  }

  const initializeObserver = useCallback(() => {
    if (!enabled) return

    disconnectObserver()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }
  }, [onIntersect, enabled, threshold, rootMargin])

  useEffect(() => {
    initializeObserver()
    return () => disconnectObserver()
  }, [initializeObserver])

  return { targetRef }
}
