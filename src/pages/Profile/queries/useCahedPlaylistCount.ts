import { useEffect, useState } from 'react'
import { Playlist } from '@/pages/Home/model/types'
import { profilePageQueryKeys } from './profilePageQueryKeys'
import { queryClient } from '@/shared/model/lib/queryClient'

export const useCachedPlaylistCount = (profileId?: string) => {
  const [playlistCount, setPlaylistCount] = useState(0)

  useEffect(() => {
    const update = () => {
      const data = queryClient.getQueryData<Playlist[]>(profilePageQueryKeys.playlists(profileId))
      if (data) {
        // 비동기적으로 상태 업데이트
        window.requestAnimationFrame(() => setPlaylistCount(data.length))
      }
    }

    update() // 초기값 설정

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      const targetKey = profilePageQueryKeys.playlists(profileId)
      if (event?.query?.queryKey?.toString() === targetKey.toString()) {
        // 상태 업데이트를 `requestAnimationFrame`으로 예약
        window.requestAnimationFrame(update)
      }
    })

    return () => unsubscribe()
  }, [profileId]) // profileId가 바뀔 때마다 실행

  return playlistCount
}
