import React, { useState, useEffect } from 'react'
import { getCommentsByPlaylistId, Comment } from '@/shared/model/api/comments'
import CommentItem from './components/CommentItem'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { motion, AnimatePresence } from 'motion/react'

interface CommentListProps {
  playlistId: string
  currentProfileId: string
}

const CommentList: React.FC<CommentListProps> = ({ playlistId, currentProfileId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCommentsByPlaylistId(playlistId)
      console.log('새로 불러온 댓글 목록:', data)
      setComments(data)
    } catch (err) {
      console.error('댓글 로딩 중 오류:', err)
      setError('댓글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (playlistId) {
      fetchComments()
    }
  }, [playlistId, refreshKey])

  // 댓글 삭제 후 목록 새로고침
  const handleCommentDeleted = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-slate-800 p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-slate-700" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-1/4 bg-slate-700" />
                <Skeleton className="h-3 w-full bg-slate-700" />
                <Skeleton className="mt-1 h-3 w-3/4 bg-slate-700" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg bg-red-900/30 p-4 text-center"
      >
        <p className="text-red-200">{error}</p>
        <button
          onClick={fetchComments}
          className="mt-2 rounded bg-red-700 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          다시 시도
        </button>
      </motion.div>
    )
  }

  if (comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg bg-slate-800 p-4 text-center"
      >
        <p className="text-slate-400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout" initial={false}>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
            }}
            transition={{
              opacity: { duration: 0.15, ease: 'easeOut' },
              scale: { duration: 0.2, ease: 'easeOut' },
              y: { duration: 0.2, ease: 'easeOut' },
              layout: { duration: 0.3, ease: 'easeInOut' },
            }}
            className="origin-top"
          >
            <CommentItem
              comment={comment}
              playlistId={playlistId}
              currentProfileId={currentProfileId}
              onReplyAdded={handleCommentDeleted}
              onCommentDeleted={handleCommentDeleted}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default CommentList
