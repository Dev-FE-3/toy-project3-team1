import { UserCard } from '@/shared/components/UserCard/UserCard'
import { SendHorizontal } from 'lucide-react'
interface CommentTriggerProps {
  nickname: string
  commentCount?: number
  onToggleCommentPopup?: () => void
}

export default function CommentTrigger({
  nickname,
  commentCount = 0,
  onToggleCommentPopup,
}: CommentTriggerProps) {
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
        onClick={onToggleCommentPopup}
        className="bg-c700 text-c400 mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left"
        aria-label="댓글 작성하기"
      >
        <UserCard nickname={nickname} nicknameActive={false} />
        <span>댓글 달기...</span>
        <SendHorizontal className="ml-auto h-4 w-4" />
      </button>
    </div>
  )
}
