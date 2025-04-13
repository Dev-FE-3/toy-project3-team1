import BackButton from '@/shared/components/BackButton/BackButton'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import Avatar from '@/shared/components/Avatar/Avatar'
import SearchBar from '@/shared/components/SearchBar/SearchBar'
import TabMenu from '@/shared/components/TabMenu/TabMenu'
import HashTag from '@/shared/components/HashTag/HashTag'
import MoreMenu, { MenuItem } from '@/shared/components/MoreMenu/MoreMenu'
import StatusButton from '@/shared/components/StatusButton/StatusButton'
import VideoPlayer from '@/shared/components/VideoPlayer/VideoPlayer'
import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import CommentInput from '@/features/playlistDetail/CommentInput/CommentInput'

export default function DesignSystem() {
  // TapMenu 상태 관리
  const [activeTab, setActiveTab] = useState<'form1' | 'form2'>('form1')
  const [inputValue, setInputValue] = useState('')
  const [imageCount, setImageCount] = useState(0)

  const completedTabs = useMemo(() => {
    const completed = new Set<string>()
    if (inputValue.trim() !== '') completed.add('form1')
    if (imageCount > 0) completed.add('form2')
    return completed
  }, [inputValue, imageCount])

  // const handleTabChange = (tabId: string) => {
  //   console.log('Selected tab:', tabId)
  // }

  // MoreMenu 예제를 위한 아이템 설정
  const menuItems: MenuItem[] = [
    { label: '삭제', onClick: () => console.log('삭제 클릭됨') },
    { label: '삭제', onClick: () => console.log('다른 삭제 옵션 클릭됨') },
  ]

  // 상태 버튼 토글을 위한 상태
  const [buttonStatus, setButtonStatus] = useState<'active' | 'inactive'>('inactive')

  const toggleButtonStatus = () => {
    setButtonStatus(buttonStatus === 'active' ? 'inactive' : 'active')
  }

  // YouTube 비디오 ID
  const videoId = 'mApblqoutE8'

  return (
    <>
      <section className="mb-12">
        <div className="bg-c50 flex flex-col gap-4 rounded-lg border p-6">
          <div>
            <p className="text-captionM mb-2">BackButton:</p>
            <BackButton />
          </div>

          <div>
            <p className="text-captionM mb-2">LikeIcon:</p>
            <LikeIcon isLiked={false} />
          </div>

          <div>
            <p className="text-captionM mb-2">BookmarkIcon:</p>
            <BookmarkIcon isBookmarked={false} />
          </div>

          <div>
            <p className="text-captionM mb-2">Avatar:</p>
            <Avatar />
            <Avatar size="medium" />
            <Avatar size="large" />
          </div>

          <div>
            <p className="text-captionM mb-2">SearchBar:</p>
            <SearchBar className="max-w-md" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-c900 rounded-lg">
          <TabMenu
            tabs={[
              { id: 'form1', label: '정보 입력', checkable: true },
              { id: 'form2', label: '이미지 등록', checkable: true },
            ]}
            defaultActiveTab="form1"
            onTabChange={(tabId) => setActiveTab(tabId as 'form1' | 'form2')}
            completedTabs={completedTabs} // ✅ 체크 표시용 Set 전달
          />

          <div className="bg-c700 p-6">
            {activeTab === 'form1' && (
              <input
                type="text"
                placeholder="여기에 입력"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-c50 w-full rounded border px-4 py-2"
              />
            )}

            {activeTab === 'form2' && (
              <div className="space-y-4">
                <Button onClick={() => setImageCount((prev) => prev + 1)}>➕ 이미지 추가</Button>
                <p>등록된 이미지 수: {imageCount}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-c50 flex flex-wrap gap-3 rounded-lg border p-6">
          <HashTag tag="오버워치" onClick={() => console.log('오버워치 태그 클릭됨')} />
          <HashTag tag="전략" onClick={() => console.log('전략 태그 클릭됨')} />
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-c50 rounded-lg border p-6">
          <h3 className="text-captionM mb-4 text-lg">더보기 메뉴</h3>
          <div className="bg-c600 flex items-center justify-between rounded-xl p-4">
            <span className="text-c50">삭제 메뉴 예시</span>
            <MoreMenu items={menuItems} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-c50 rounded-lg border p-6">
          <h3 className="text-captionM mb-4 text-lg">상태 버튼</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">비활성 버튼</h4>
              <StatusButton status="inactive" />
            </div>
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">활성화 버튼</h4>
              <StatusButton status="active" />
            </div>
            <div className="md:col-span-2">
              <h4 className="text-captionM mb-2 text-sm text-gray-500">토글 기능</h4>
              <StatusButton status={buttonStatus} onClick={toggleButtonStatus} />
              <p className="mt-2 text-sm text-gray-500">
                현재 상태:{' '}
                <span className="text-captionM">
                  {buttonStatus === 'active' ? '활성화' : '비활성'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-c50 rounded-lg border p-6">
          <h3 className="text-captionM mb-4 text-lg">16:9 비율의 비디오 플레이어</h3>

          <div className="space-y-8">
            {/* 전체 너비 (100%) */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">전체 너비 (100%)</h4>
              <VideoPlayer videoId={videoId} />
            </div>

            {/* 중간 크기 (75%) */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">중간 크기 (75%)</h4>
              <VideoPlayer videoId={videoId} className="w-3/4" />
            </div>

            {/* 중간 작은 크기 (50%) */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">중간 작은 크기 (50%)</h4>
              <VideoPlayer videoId={videoId} className="w-1/2" />
            </div>

            {/* 작은 크기 (25%) */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">작은 크기 (25%)</h4>
              <VideoPlayer videoId={videoId} className="w-1/4" />
            </div>

            {/* 그리드 레이아웃 */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">그리드 레이아웃 (2x2)</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <VideoPlayer videoId={videoId} />
                <VideoPlayer videoId={videoId} />
                <VideoPlayer videoId={videoId} />
                <VideoPlayer videoId={videoId} />
              </div>
            </div>

            {/* 반응형 컨테이너 */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">반응형 컨테이너</h4>
              <div className="rounded-lg border border-dashed border-gray-300 p-4">
                <p className="mb-2 text-sm text-gray-500">
                  다양한 화면 크기에 따라 자동으로 비율 유지
                </p>
                <div className="mx-auto w-full max-w-4xl">
                  <VideoPlayer videoId={videoId} />
                </div>
              </div>
            </div>

            {/* 부모 요소 크기에 맞춤 */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">다양한 컨테이너 크기</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="mb-2 text-xs text-gray-500">작은 컨테이너</p>
                  <VideoPlayer videoId={videoId} />
                </div>
                <div className="rounded-lg bg-gray-100 p-4 md:col-span-2">
                  <p className="mb-2 text-xs text-gray-500">큰 컨테이너</p>
                  <VideoPlayer videoId={videoId} />
                </div>
              </div>
            </div>

            {/* 컨트롤러 설정 */}
            <div>
              <h4 className="text-captionM mb-2 text-sm text-gray-500">컨트롤러 설정</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="mb-2 text-xs text-gray-500">컨트롤러 표시 (기본값)</p>
                  <VideoPlayer videoId={videoId} showControls={true} />
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="mb-2 text-xs text-gray-500">컨트롤러 숨김</p>
                  <VideoPlayer videoId={videoId} showControls={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <CommentInput />
      </div>
    </>
  )
}
