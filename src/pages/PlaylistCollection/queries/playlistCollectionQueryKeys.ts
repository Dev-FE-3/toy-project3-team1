// 플레이리스트 컬렉션 쿼리 키
export const playlistCollectionKeys = {
  all: ['playlistCollection'] as const,
  lists: () => [...playlistCollectionKeys.all, 'list'] as const,
  list: (profileId: string | null, activeKey: string) =>
    [...playlistCollectionKeys.lists(), profileId, activeKey] as const,
}
