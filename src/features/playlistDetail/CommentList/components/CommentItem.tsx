import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Comment, deleteComment } from '@/shared/model/api/comments'
import Avatar from '@/shared/components/Avatar/Avatar'
import { Button } from '@/shared/components/ui/button'
import { addComment } from '@/shared/model/api/comments'

interface CommentItemProps {
  comment: Comment
  playlistId: string
  currentProfileId: string
  onReplyAdded: () => void
  onCommentDeleted: () => void
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  playlistId,
  currentProfileId,
  onReplyAdded,
  onCommentDeleted,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const nickname = comment.profiles?.nickname || '사용자'
  const formattedDate = new Date(comment.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isOwnComment = comment.profile_id === currentProfileId

  const handleDeleteComment = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return

    setIsDeleting(true)

    try {
      console.log('comment.id', comment)
      await deleteComment(comment.id)
      onCommentDeleted()
    } catch (error) {
      console.error('댓글 삭제 중 오류:', error)
      alert('댓글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(replyContent, playlistId, currentProfileId, comment.id)
      setReplyContent('')
      setShowReplyForm(false)
      onReplyAdded()
    } catch (error) {
      console.error('댓글 추가 중 오류:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <div className="flex items-start gap-3">
        <Avatar />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{nickname}</span>
              <span className="text-xs text-slate-400">{formattedDate}</span>
            </div>
            {isOwnComment && (
              <button
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="text-slate-400 transition-colors hover:text-red-500"
                title="댓글 삭제"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <p className="mt-1 text-slate-200">{comment.content}</p>
          <div className="mt-2">
            <button
              className="text-xs text-slate-400 hover:text-white"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? '취소' : '답글 달기'}
            </button>
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                  className="flex-1 rounded bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
                >
                  {isSubmitting ? '전송 중...' : '전송'}
                </Button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="rounded-lg bg-slate-700 p-3">
                  <div className="flex items-center gap-2">
                    <Avatar />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {reply.profiles?.nickname || '사용자'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(reply.created_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-200">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
