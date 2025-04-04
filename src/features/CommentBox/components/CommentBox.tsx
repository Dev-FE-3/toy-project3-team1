import React, { useState } from 'react'
import Avatar from '@/shared/components/Avatar/Avatar'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export default function CommentBox() {
  const [comment, setComment] = useState('')

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }

  const handleSubmit = () => {
    if (!comment.trim()) return
    console.log('댓글 전송:', comment)
    setComment('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full rounded-lg bg-slate-800 p-4">
      <div className="mb-3 text-white">
        <span className="font-medium">댓글</span> <span className="text-slate-300">64</span>
      </div>

      <div className="flex items-center gap-3">
        <Avatar />

        <div className="relative flex flex-1 items-center rounded-full bg-slate-600">
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            placeholder="댓글 달기"
            className="w-full bg-transparent px-5 py-3 pr-14 text-white placeholder-slate-400 outline-none"
            aria-label="댓글 입력"
            tabIndex={0}
          />

          <div className="absolute right-2 flex h-10 w-10 items-center justify-center">
            <Button
              onClick={handleSubmit}
              className="h-10 w-10 flex-1 p-0 hover:bg-slate-400"
              aria-label="댓글 전송"
              tabIndex={0}
            >
              <SendHorizontal className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
