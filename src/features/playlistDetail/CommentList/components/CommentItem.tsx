import React, { useState, useRef, useEffect } from 'react'
import { Trash2, CircleCheck } from 'lucide-react'
import { Comment, deleteComment } from '@/shared/model/api/comments'
import Avatar from '@/shared/components/Avatar/Avatar'
import { AvatarFallback } from '@/shared/components/ui/avatar'
import CommentInput from '@/features/playlistDetail/CommentInput/CommentInput'
import { Button } from '@/shared/components/ui/button'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'

interface CommentItemProps {
  comment: Comment
  playlistId: string
  currentProfileId: string
  playListAuthorProfileId: string
  onReplyAdded: () => void
  onCommentDeleted: () => void
}

const CommentItem = ({
  comment,
  playlistId,
  currentProfileId,
  playListAuthorProfileId,
  onReplyAdded,
  onCommentDeleted,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const replyInputRef = useRef<HTMLInputElement>(null)

  // 답글 폼이 표시될 때 input에 focus

  // 댓글 작성자별 닉네임

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
    setShowReplyForm(false)
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
        <Avatar size="small">
          <AvatarFallback>{nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* 댓글 작성자 정보 */}
              <div className="bg-c300 text-c700 flex items-center gap-1 rounded-2xl px-2 py-1">
                {/* 댓글 작성자 닉네임 */}
                <span className="text-c700 text-captionM">{nickname}</span>
                {/* 플레이리스트 게시자와 댓글 작성자가 동일할 때 마크 표시 */}
                {comment.profile_id === playListAuthorProfileId && (
                  <CircleCheck size={16} className="text-c700" />
                )}
              </div>
              {/* 댓글 작성일 */}
              <span className="text-c400 text-xs">{getRelativeTime(formattedDate)}</span>
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
              className="text-c400 hover:text-c50 text-xs"
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
                    <Avatar size="small">
                      <AvatarFallback>
                        {reply?.profiles?.nickname?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-c300 text-c700 flex items-center gap-1 rounded-2xl px-2 py-1">
                            {/* 대댓글 작성자 닉네임 */}
                            <span className="text-c700 text-captionS">
                              {reply.profiles?.nickname || '사용자'}
                            </span>
                            {/* 플레이리스트 게시자와 댓글 작성자가 동일할 때 마크 표시 */}
                            {comment.profile_id === playListAuthorProfileId && (
                              <CircleCheck size={16} className="text-c700" />
                            )}
                          </div>
                          {/* 대댓글 작성일 */}
                          <span className="text-c400 text-xs">
                            {getRelativeTime(reply.created_at)}
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
