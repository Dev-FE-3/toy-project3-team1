import { Skeleton } from '@/shared/components/ui/skeleton'
import { getCommentsByPlaylistId, type Comment } from '@/shared/model/api/comments'
import { queryClient } from '@/shared/model/lib/queryClient'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import CommentItem from './components/CommentItem'
interface CommentListProps {
  playlistId: string
  currentProfileId: string
  playListAuthorProfileId: string
}

const CommentList = ({
  playlistId,
  currentProfileId,
  playListAuthorProfileId,
}: CommentListProps) => {
  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery<Comment[]>({
    queryKey: ['comments', playlistId],
    queryFn: () => getCommentsByPlaylistId(playlistId),
    enabled: !!playlistId,
  })

  // 댓글 목록 새로고침
  const refreshComments = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', playlistId] })
  }

  // 댓글 추가 후 목록 새로고침
  const handleCommentAdded = () => {
    refreshComments()
  }

  // 댓글 삭제 후 목록 새로고침
  const handleCommentDeleted = () => {
    refreshComments()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-c800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="bg-c700 h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="bg-c700 mb-2 h-4 w-1/4" />
                <Skeleton className="bg-c700 h-3 w-full" />
                <Skeleton className="bg-c700 mt-1 h-3 w-3/4" />
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
        <p className="text-red-200">댓글을 불러오는 중 오류가 발생했습니다.</p>
        <button className="text-c50 mt-2 rounded bg-red-700 px-3 py-1 text-sm hover:bg-red-600">
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
        className="bg-c800 rounded-lg p-4 text-center"
      >
        <p className="text-c400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
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
              opacity: { duration: 0.25, ease: 'easeInOut' },
              scale: { duration: 0.3, ease: 'easeInOut' },
              y: { duration: 0.3, ease: 'easeInOut' },
              layout: { duration: 0.3, ease: 'easeInOut' },
            }}
            className="origin-top"
          >
            <CommentItem
              comment={comment}
              playlistId={playlistId}
              currentProfileId={currentProfileId}
              playListAuthorProfileId={playListAuthorProfileId}
              onReplyAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default CommentList
