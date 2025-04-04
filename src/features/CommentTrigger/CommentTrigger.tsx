import React from 'react'
import { MessageCircle } from 'lucide-react'
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
    <div className="mt-4 rounded-xl border-t border-slate-700 bg-slate-800 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          <span>댓글 </span>
          <span>{commentCount}</span>
        </p>
        <button
          onClick={onClick}
          className="text-slate-400 hover:text-white"
          aria-label="댓글 더보기"
        >
          <MessageCircle size={18} />
        </button>
      </div>

      <button
        onClick={onClick}
        className="mt-3 flex w-full items-center gap-3 rounded-xl bg-slate-700 px-4 py-3 text-left text-slate-400"
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
