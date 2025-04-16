import { useState, forwardRef } from 'react'
import Avatar, { type AvatarSize } from '@/shared/components/Avatar/Avatar'
import { AvatarFallback } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { addComment } from '@/shared/model/api/comments'
import { SendHorizontal } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/model/lib/utils'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'

interface CommentInputProps {
  playlistId: string
  profileId: string
  onCommentAdded: () => void
  parentId?: string
  className?: string
  size?: AvatarSize
}

const CommentInput = forwardRef<HTMLInputElement, CommentInputProps>(
  ({ playlistId, profileId, onCommentAdded, parentId, className, size = 'default' }, ref) => {
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { profile } = useGetAuthState()
    const playListAuthorNickname = profile?.user_metadata?.nickname

    const handleSubmit = async () => {
      if (!comment.trim()) return

      setIsSubmitting(true)
      try {
        await addComment(comment, playlistId, profileId, parentId)
        setComment('')
        console.log('1 CommentInput 댓글 추가 후 핸들링')
        onCommentAdded()
        console.log('1-1. CommentInput - onCommentAdded 호출 완료')
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
      <div
        className={cn(
          'border-c700 bg-c800 rounded-xl border-t p-3',
          size === 'sm' && 'p-2',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar size={'small'}>
            <AvatarFallback>{playListAuthorNickname?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="relative flex-grow">
            <Input
              ref={ref}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={parentId ? '답글 입력' : '댓글 달기'}
              className={cn(
                'bg-c700 placeholder:text-c400 focus:bg-c700 text-c50 w-full rounded-xl px-4 py-3 pr-11 outline-none',
                size === 'sm' && 'px-3 py-2 text-sm',
              )}
              aria-label={parentId ? '답글 입력' : '댓글 입력'}
              tabIndex={0}
              disabled={isSubmitting}
            />
            <Button
              className={cn(
                'absolute top-1/2 right-2 -translate-y-1/2 transform border-0',
                size === 'sm' && 'right-1.5 scale-90',
              )}
              onClick={handleSubmit}
              aria-label={parentId ? '답글 전송' : '댓글 전송'}
              tabIndex={0}
              disabled={isSubmitting}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
)

CommentInput.displayName = 'CommentInput'

export default CommentInput
