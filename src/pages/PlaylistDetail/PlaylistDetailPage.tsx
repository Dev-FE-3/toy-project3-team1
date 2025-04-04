import { Skeleton } from '@/shared/components/ui/skeleton'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import Avatar from '@/shared/components/Avatar/Avatar'

const PlaylistDetailPage = () => {
  return (
    <>
      <div className="flex flex-col p-4">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="bg-c500 h-[200px] w-full rounded-xl" />
        </AspectRatio>

        {/* 댓글 영역 */}
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
              <button className="text-sm text-slate-400">댓글 2개 더 보기</button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 입력 영역 - 고정 위치 */}
      <div className="absolute right-0 bottom-16 left-0 border-t border-slate-700 bg-slate-800 p-3">
        <div className="flex items-center gap-3">
          <Avatar />
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="댓글 달기"
              className="w-full rounded-full bg-slate-700 px-4 py-3 text-white placeholder-slate-400 outline-none"
            />
            <button className="absolute top-1/2 right-3 -translate-y-1/2 transform text-blue-400">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaylistDetailPage
