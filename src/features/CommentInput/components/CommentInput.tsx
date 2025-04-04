import { useState } from 'react'
import Avatar from '@/shared/components/Avatar/Avatar'
import { Button } from '@/shared/components/ui/button'
import { SendHorizontal } from 'lucide-react'
interface CommentInputProps {
  onSubmit?: (comment: string) => void
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (!comment.trim()) return

    if (onSubmit) {
      onSubmit(comment)
    }

    setComment('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="rounded-xl border-t border-slate-700 bg-slate-800 p-3">
      <p className="text-sm text-slate-400">
        <span>댓글 </span>
        <span>100</span>
      </p>
      <div className="flex items-center gap-3">
        <Avatar />
        <div className="relative flex-grow">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="댓글 달기"
            className="w-full rounded-xl bg-slate-700 px-4 py-3 text-white placeholder-slate-400 outline-none"
            aria-label="댓글 입력"
            tabIndex={0}
          />
          <Button
            className="absolute top-1/2 right-2 -translate-y-1/2 transform border-0 p-0"
            onClick={handleSubmit}
            aria-label="댓글 전송"
            tabIndex={0}
          >
            <SendHorizontal className="text-c300 min-h-5 min-w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
