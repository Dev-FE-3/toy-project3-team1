import { useRef, useState } from 'react'
import { cn } from '@/shared/model/lib/utils'

interface StatusButtonProps {
  status: 'active' | 'inactive'
  onClick?: () => void
  className?: string
}

export default function StatusButton({ status, onClick, className }: StatusButtonProps) {
  const pressedRef = useRef(false)
  const [isPressed, setIsPressed] = useState(false)

  const handlePointerDown = () => {
    pressedRef.current = true
    setIsPressed(true)
  }

  const handlePointerLeave = () => {
    pressedRef.current = false
    setIsPressed(false)
  }

  const handlePointerUp = () => {
    if (pressedRef.current) {
      onClick?.()
    }
    pressedRef.current = false
    setIsPressed(false)
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
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
