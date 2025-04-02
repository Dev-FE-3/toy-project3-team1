import React from 'react'
import { cn } from '@/shared/model/lib/utils'

interface StatusButtonProps {
  status: 'active' | 'inactive'
  onClick?: () => void
  className?: string
}

export default function StatusButton({ status, onClick, className }: StatusButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg py-3 text-center font-medium transition-colors',
        status === 'active'
          ? 'bg-[#1E293B] text-white hover:bg-[#1E293B]/90'
          : 'bg-[#CBD5E1] text-[#64748B] hover:bg-[#CBD5E1]/90',
        className,
      )}
    >
      {status === 'active' ? '활성화' : '비활성'}
    </button>
  )
}
