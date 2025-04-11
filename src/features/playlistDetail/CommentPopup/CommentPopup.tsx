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
const CommentPopupRoot = ({
  open,
  onOpenChange,
  children,
  className,
  snapPoints = [0.9],
  activeSnapPoint = 0,
}: CommentPopupProps) => {
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
        <div className="absolute inset-x-0 bottom-14 z-50">
          <motion.div
            ref={popupRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'max-h-[59vh] overflow-auto rounded-t-xl bg-slate-800 text-white',
              className,
            )}
            style={{
              height: `${snapPoints[activeSnapPoint] * 100}vh`,
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

//
// const Trigger = ({
//   className,
//   children,
//   onClick,
//   ...props
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
//   return (
//     <button className={cn('cursor-pointer', className)} onClick={onClick} {...props}>
//       {children}
//     </button>
//   )
// }

const Title = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('p-4', className)} {...props} />
}

export const CommentPopup = Object.assign(CommentPopupRoot, {
  // Trigger,
  Title,
  Header,
  Content,
})
