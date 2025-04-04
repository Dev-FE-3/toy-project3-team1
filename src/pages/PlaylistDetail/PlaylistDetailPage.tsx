import { useState } from 'react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'
import { CommentPopup } from '@/features/CommentPopup/CommentPopup'
import VideoInfo from '@/features/VideoInfo/VideoInfo'
import AuthorInfo from '@/features/AuthorInfo/AuthorInfo'
import CommentTrigger from '@/features/CommentTrigger/CommentTrigger'
import CommentInput from '@/features/CommentInput/components/CommentInput'
import VideoList from '@/features/VideoList/VideoList'

const PlaylistDetailPage = () => {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)

  const handleOpenCommentPopup = () => {
    setIsCommentPopupOpen(true)
  }

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId)
  }

  // 샘플 비디오 데이터
  const videos = [
    {
      id: '1',
      title: 'ORISA BARRIER STRATEGY',
      thumbnail: 'https://placehold.co/300x169/2a3a4a/FFF?text=Orisa',
      views: '240회',
      date: '2024.12.1',
      duration: '1:42',
    },
    {
      id: '2',
      title: '오버워치2 오리사 장인의 신규 메타 전략! 파고들는 방법과 효과적인 궁극기 사용법!',
      thumbnail: 'https://placehold.co/300x169/3a4a5a/FFF?text=Orisa2',
      views: '1.2만회',
      date: '2024.11.15',
      duration: '8:42',
    },
    {
      id: '3',
      title: '탱커 오리사 3분만에 배우기! 초보자도 할 수 있는 쉬운 팁',
      thumbnail: 'https://placehold.co/300x169/4a5a6a/FFF?text=Orisa3',
      views: '3.5만회',
      date: '2024.10.28',
      duration: '3:11',
    },
    {
      id: '4',
      title: '오리사 신스킨으로 랭크 승률 높이는 방법! 이건 꼭 봐야 합니다',
      thumbnail: 'https://placehold.co/300x169/5a6a7a/FFF?text=Orisa4',
      views: '8천회',
      date: '2024.10.5',
      duration: '12:32',
    },
    {
      id: '5',
      title: '오리사 자바린 던지기 마스터하기 - 프로게이머의 팁과 요령',
      thumbnail: 'https://placehold.co/300x169/6a7a8a/FFF?text=Orisa5',
      views: '5.1만회',
      date: '2024.9.22',
      duration: '6:45',
    },
  ]

  return (
    <>
      <div className="flex h-[calc(100vh-9rem)] flex-col p-4">
        <div className="flex-shrink-0">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="bg-c500 h-[200px] w-full rounded-xl" />
          </AspectRatio>

          {/* 비디오 정보 */}
          <VideoInfo />

          {/* 작성자 정보 */}
          <AuthorInfo />

          {/* 댓글 트리거 */}
          <CommentTrigger commentCount={100} onClick={handleOpenCommentPopup} />
        </div>

        {/* 플레이리스트 비디오 목록 - 남은 공간을 모두 채움 */}
        <VideoList videos={videos} onVideoClick={handleVideoClick} />

        {/* 댓글 팝업 */}
        <CommentPopup open={isCommentPopupOpen} onOpenChange={setIsCommentPopupOpen}>
          <CommentPopup.Header>
            <CommentPopup.Title>댓글</CommentPopup.Title>
          </CommentPopup.Header>
          <CommentPopup.Content>
            <div className="space-y-4">
              <p className="text-slate-300">댓글 목록이 여기에 표시됩니다.</p>
              <CommentInput onSubmit={() => setIsCommentPopupOpen(false)} />
            </div>
          </CommentPopup.Content>
        </CommentPopup>
      </div>
    </>
  )
}

export default PlaylistDetailPage
