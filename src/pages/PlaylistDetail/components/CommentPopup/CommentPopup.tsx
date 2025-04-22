// src/shared/components/custom-drawer/CustomDrawer.tsx
import React, { useRef, useEffect } from 'react'
import { cn } from '@/shared/model/lib/utils'
import { AnimatePresence, motion } from 'motion/react'

interface CommentPopupProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  snapPoints?: number[]
  activeSnapPoint?: number
  className?: string
}

// 메인 CommentPopup 컴포넌트
const CommentPopupRoot = ({ open, onOpenChange, children, className }: CommentPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onOpenChange?.(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onOpenChange])

  return (
    <AnimatePresence>
      {open && (
        <div className="commentContainer absolute inset-x-0 bottom-0 z-50">
          <motion.div
            ref={popupRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 70, stiffness: 700 }}
            className={cn('bg-c800 text-c50 h-[62dvh] max-h-[55vh] rounded-t-4xl', className)}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'header border-c700 flex flex-col gap-1.5 rounded-t-4xl px-3 pt-2 pb-3',
        className,
      )}
      {...props}
    />
  )
}

const Title = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h3 className={cn('title pl-4 text-lg font-semibold', className)} {...props} />
}

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('content flex h-full flex-col px-4 pb-10', className)} {...props}></div>
}

export const CommentPopup = Object.assign(CommentPopupRoot, {
  // Trigger,
  Title,
  Header,
  Content,
})
