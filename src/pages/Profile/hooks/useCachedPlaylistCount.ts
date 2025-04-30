import { queryClient } from '@/shared/model/lib/queryClient'
import { useEffect, useState } from 'react'
import { getCachedPlaylists } from '../queries/getCachedPlaylists'
import { profilePageQueryKeys } from '../queries/profilePageQueryKeys'

export const useCachedPlaylistCount = (profileId?: string) => {
  const [playlistCount, setPlaylistCount] = useState(0)

  const updatePlaylistCount = () => {
    const data = getCachedPlaylists(profileId)

    if (!Array.isArray(data)) {
      console.error('Unexpected cache data:', data)
      return
    } // 에러 처리

    if (data) {
      // 캐시된 데이터가 변경되었을 때만 상태 업데이트
      const newCount = data.length
      if (newCount !== playlistCount) {
        setPlaylistCount(newCount) // 새로운 값으로 상태 업데이트
      }
    }
  }

  const targetKey = profilePageQueryKeys.playlists(profileId)

  useEffect(() => {
    updatePlaylistCount() // 초기값 설정

    // 구독하고, 상태 업데이트가 필요할 때만 호출
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.toString() === targetKey.toString()) {
        updatePlaylistCount() // 데이터가 변경되었을 때 상태 업데이트
      }
    })

    return () => unsubscribe() // 컴포넌트 언마운트 시 구독 해제
  }, [profileId, playlistCount]) // profileId나 playlistCount가 변경될 때마다 실행

  return playlistCount
}
