import React from 'react'
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'

interface CommentTriggerProps {
  commentCount?: number
  onClick?: () => void
}

export default function CommentTrigger({ commentCount = 0, onClick }: CommentTriggerProps) {
  return (
    <div className="border-c700 bg-c800 mt-4 rounded-xl border-t p-3">
      <div className="flex items-center justify-between">
        {/* 댓글 수 */}
        <p className="text-c400 text-sm">
          <span>댓글 </span>
          <span>{commentCount}</span>
        </p>
      </div>

      <button
        onClick={onClick}
        className="bg-c700 text-c400 mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left"
        aria-label="댓글 작성하기"
      >
        <AvatarComponent className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="사용자 이미지" />
          <AvatarFallback>U</AvatarFallback>
        </AvatarComponent>
        <span>댓글 달기...</span>
      </button>
    </div>
  )
}
