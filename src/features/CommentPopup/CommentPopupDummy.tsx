import Avatar from '@/shared/components/Avatar/Avatar'

interface CommentPopupDummyProps {
  comments?: () => void
}

export default function CommentPopupDummy({ comments }: CommentPopupDummyProps) {
  return (
    <div className="mt-4 border-t border-slate-800 pt-4 pb-16">
      <h2 className="mb-4 text-xl">댓글</h2>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {/* 댓글 아이템 */}
        <div className="flex items-start gap-3">
          <Avatar />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">김철두</span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-400">3일</span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-400">작성자</span>
            </div>
            <p className="mt-1 text-slate-300">
              정말 영상 맛집이네요 인정 와우 대박 쩔어요 번창하세요 대박대박박박박스
            </p>
            <button className="mt-2 text-sm text-slate-400">댓글달기</button>
          </div>
        </div>

        {/* 댓글 아이템 */}
        <div className="flex items-start gap-3">
          <Avatar />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">김떡볶이</span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-400">3일</span>
            </div>
            <p className="mt-1 text-slate-300">
              떡볶이 먹고 싶지만 배가 고프지 않아 영상을 봤습니다. 이상하게 배고프지만서도 배가
              고프지 않고 와우와우 헙들고 집가고 싶고 산책하고 싶다.
            </p>
            <button className="mt-2 text-sm text-slate-400">댓글달기</button>
          </div>
        </div>

        <div className="text-center">
          <button className="text-sm text-slate-400" onClick={comments}>
            댓글 2개 더 보기
          </button>
        </div>
      </div>
    </div>
  )
}
