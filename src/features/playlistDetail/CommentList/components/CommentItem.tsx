import React, { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Comment, deleteComment } from '@/shared/model/api/comments'
import Avatar from '@/shared/components/Avatar/Avatar'
import CommentInput from '@/features/playlistDetail/CommentInput/CommentInput'
import { Button } from '@/shared/components/ui/button'

interface CommentItemProps {
  comment: Comment
  playlistId: string
  currentProfileId: string
  onReplyAdded: () => void
  onCommentDeleted: () => void
}

const CommentItem = ({
  comment,
  playlistId,
  currentProfileId,
  onReplyAdded,
  onCommentDeleted,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const replyInputRef = useRef<HTMLInputElement>(null)

  // 답글 폼이 표시될 때 input에 focus

  const nickname = comment.profiles?.nickname || '사용자'
  const formattedDate = new Date(comment.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isOwnComment = comment.profile_id === currentProfileId

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      await deleteComment(commentId)
      onCommentDeleted()
    } catch (error) {
      console.error('댓글 삭제 중 오류:', error)
      alert('댓글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 댓글, 대댓글 작성 후 핸들링
  const handleReplyAdded = () => {
    onReplyAdded()
    // setShowReplyForm(false)
  }

  useEffect(() => {
    if (showReplyForm) {
      replyInputRef.current?.focus()
    }
  }, [showReplyForm])

  return (
    <div className="commentItemContainer bg-c800 rounded-lg p-4">
      {/* 댓글 목록 */}
      <div className="commentItem flex items-start gap-3">
        <Avatar />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* 댓글 작성자 닉네임 */}
              <span className="font-medium text-white">{nickname}</span>
              {/* 댓글 작성일 */}
              <span className="text-c400 text-xs">{formattedDate}</span>
            </div>
            {isOwnComment && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                disabled={isDeleting}
                className="text-c400 transition-colors hover:text-red-500"
                title="댓글 삭제"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          {/* 댓글 내용 */}
          <p className="text-c200 mt-1">{comment.content}</p>
          {/* 댓글 달기 버튼 */}
          <div className="mt-2">
            <button
              className="text-c400 text-xs hover:text-white"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? '취소' : '답글 달기'}
            </button>
          </div>

          {/* 대댓글 입력 폼 */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentInput
                ref={replyInputRef}
                playlistId={playlistId}
                profileId={currentProfileId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                size="small"
                className="bg-c700 border-0"
              />
            </div>
          )}

          {/* 대댓글 목록 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="bg-c700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Avatar />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {reply.profiles?.nickname || '사용자'}
                          </span>
                          <span className="text-c400 text-xs">
                            {new Date(reply.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {reply.profile_id === currentProfileId && (
                          <Button
                            onClick={() => handleDeleteComment(reply.id)}
                            disabled={isDeleting}
                            className="text-c400 transition-colors hover:text-red-500"
                            title="댓글 삭제"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                      {/* 대댓글 내용 */}
                      <p className="text-c200">{reply.content}</p>
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
