import { useRef, useState } from 'react'
import { cn } from '@/shared/model/lib/utils'

interface StatusButtonProps {
  status: 'active' | 'inactive'
  onClick?: () => void
  className?: string
}

export default function StatusButton({ status, onClick, className }: StatusButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pressedRef = useRef(false)
  const [isPressed, setIsPressed] = useState(false)

  const handlePointerDown = () => {
    pressedRef.current = true
    setIsPressed(true)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const isInside = buttonRef.current?.contains(event.target as Node)
    if (pressedRef.current && isInside) onClick?.()
    pressedRef.current = false
    setIsPressed(false)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom

    if (!inside) {
      pressedRef.current = false
      setIsPressed(false)
    }
  }

  const handlePointerLeave = () => {
    pressedRef.current = false
    setIsPressed(false)
  }

  const handlePointerCancel = () => {
    pressedRef.current = false
    setIsPressed(false)
  }

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      className={cn(
        '!text-textM w-full touch-none rounded-lg py-3 text-center transition-colors',
        status === 'active'
          ? isPressed
            ? 'bg-c700 text-c50'
            : 'bg-c600 text-c50 hover:bg-c800 opacity-100'
          : 'bg-c600 text-c50 opacity-60',
        className,
      )}
    >
      {status === 'active' ? '활성화' : '비활성'}
    </button>
  )
}
