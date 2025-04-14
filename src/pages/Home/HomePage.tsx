import { Categories } from '@/pages/Home/components/Categories/Categories'
import { useCategoryFilter } from '@/pages/Home/hooks/useCategoryFilter'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { GAMES } from './constants/GAMES'
import { limitCategoryCount } from './utils/limitCategoryCount'
import { useInfinitePlaylists } from './hooks/useInfinitePlaylists'
import { useEffect, useRef } from 'react'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { queryClient } from '@/shared/model/lib/queryClient'

const HomePage = () => {
  const { profile } = useGetAuthState()
  const { selectedCategory, handleCategorySelect } = useCategoryFilter() // 선택된 카테고리 상태 관리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePlaylists(
    profile?.id,
    selectedCategory,
  ) // 무한 스크롤을 위한 데이터 가져오기 (로그인한 사용자의 플레이리스트 제외)
  const gameCount = limitCategoryCount(GAMES.length) // 카테고리 개수 제한

  // 사용자 변경 시 쿼리 초기화
  useEffect(() => {
    if (profile?.id) {
      queryClient.removeQueries({
        queryKey: ['playlists', profile.id, selectedCategory],
      })
    }
  }, [profile?.id])

  const playlists = data?.pages.flat() ?? []
  const loadMoreRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage])

  return (
    <>
      <Categories
        gameList={GAMES}
        count={gameCount}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <PlaylistContainer key={selectedCategory} playlists={playlists} />
      <div ref={loadMoreRef} />
    </>
  )
}

export default HomePage
