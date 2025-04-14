import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useInfinitePlaylists } from './hooks/useInfinitePlaylists'
import { useEffect } from 'react'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '@/shared/model/lib/queryClient'
import { useInView } from 'react-intersection-observer'

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, handleCategorySelect } = useCategoryFilter() // 선택된 카테고리 상태 관리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePlaylists(
    profile?.id,
    selectedCategory,
  ) // 무한 스크롤을 위한 데이터 가져오기 (로그인한 사용자의 플레이리스트 제외)
  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 }) // 무한 스크롤을 위한 감지 요소
  const gameCount = limitCategoryCount(GAMES.length) // 카테고리 개수 제한

  // inview가 true일 때 fetchNextPage 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 사용자 변경 시 쿼리 초기화
  useEffect(() => {
    if (profile?.id) {
      queryClient.removeQueries({
        queryKey: ['playlists', profile.id, selectedCategory],
      })
    }
  }, [profile?.id])

  const playlists = data?.pages.flat() ?? []

  return (
    <>
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <PlaylistContainer key={selectedCategory} playlists={playlists} />
      {/* 감시 대상 엘리먼트 */}
      <div ref={loadMoreRef} style={{ height: 1 }} />

      {/* 로딩 중이면 로딩 스피너 보여주기 */}
      {isFetchingNextPage && <div style={{ textAlign: 'center' }}>불러오는 중...</div>}
    </>
  )
}

export default HomePage
