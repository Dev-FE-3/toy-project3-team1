// 플레이리스트 컬렉션 쿼리 키
export const playlistCollectionKeys = {
  all: ['playlistCollection'],
  lists: () => [...playlistCollectionKeys.all, 'list'],
  list: (profileId: string | null, activeKey: string) => [
    ...playlistCollectionKeys.lists(),
    profileId,
    activeKey,
  ],
} as const
