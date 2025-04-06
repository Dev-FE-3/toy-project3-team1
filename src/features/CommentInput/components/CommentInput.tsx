import { useState } from 'react'
import Avatar from '@/shared/components/Avatar/Avatar'
import { Button } from '@/shared/components/ui/button'
import { addComment } from '@/shared/model/api/comments'

interface CommentInputProps {
  playlistId: string
  profileId: string
  onCommentAdded: () => void
}

export default function CommentInput({ playlistId, profileId, onCommentAdded }: CommentInputProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(comment, playlistId, profileId)
      setComment('')
      onCommentAdded() // 부모 컴포넌트에 알림
    } catch (error) {
      console.error('댓글 추가 중 오류:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="rounded-xl border-t border-slate-700 bg-slate-800 p-3">
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
            disabled={isSubmitting}
          />
          <Button
            className="absolute top-1/2 right-2 -translate-y-1/2 transform border-0"
            onClick={handleSubmit}
            aria-label="댓글 전송"
            tabIndex={0}
            disabled={isSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-c300"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
