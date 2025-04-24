import { useParams } from 'react-router-dom'

import { CardList, Tab } from '@/pages/PlaylistCollection/components'
import { usePlaylistCollection } from '@/pages/PlaylistCollection/hooks'
import { TabKey } from '@/pages/PlaylistCollection/model'
import HashTag from '@/shared/components/HashTag/HashTag'
import { useUserStore } from '@/shared/store/userStore'

const TAB_ITEMS = [
  { key: 'myPlaylists', label: '내 플리' },
  { key: 'subscribedPlaylists', label: '구독 플리' },
]

const hideScrollbarStyles = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch',
} as const

export const PlaylistContent = () => {
  const { profileId } = useParams()
  const storeProfileId = useUserStore((state) => state.profileId)

  const {
    playlists,
    isLoading,
    hasMore,
    activeKey,
    setActiveKey,
    handleLoadMore,
    handleUnsubscribe,
  } = usePlaylistCollection({
    profileId: profileId || storeProfileId || null,
  })

  if (!storeProfileId) {
    return <div className="mt-4 text-center text-red-500">로그인이 필요합니다.</div>
  }

  const handleTabChange = (key: TabKey) => {
    setActiveKey(key)
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-9rem)] flex-col px-4">
      <Tab items={TAB_ITEMS} activeKey={activeKey} onTabChange={handleTabChange} />
      <div
        className="mt-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={hideScrollbarStyles}
      >
        <div className="mb-4">
          <HashTag tag="전체" size="medium" />
        </div>
        <CardList
          playlists={playlists}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onUnsubscribe={handleUnsubscribe}
          isSubscribedTab={activeKey === 'subscribedPlaylists'}
        />
      </div>
    </div>
  )
}
