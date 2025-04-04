// src/shared/components/custom-drawer/CustomDrawer.tsx
import React, { useState, useEffect } from 'react'
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
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-x-0 bottom-16 z-50">
          <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'max-h-[80vh] overflow-auto rounded-t-xl bg-slate-800 text-white',
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

// 서브 컴포넌트들
const Trigger = ({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={cn('cursor-pointer', className)} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('p-4', className)} {...props} />
}

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

const Title = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

// 복합 컴포넌트 구성
export const CommentPopup = Object.assign(CommentPopupRoot, {
  Trigger,
  Content,
  Header,
  Title,
})
