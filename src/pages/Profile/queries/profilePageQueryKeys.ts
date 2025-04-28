export const profilePageQueryKeys = {
  all: ['profilePage'] as const, // 최상위 네임스페이스
  playlists: (profileId?: string) =>
    [...profilePageQueryKeys.all, 'playlists_with_items', 'playlists', profileId] as const,
  profile: (profileId?: string) => [...profilePageQueryKeys.all, 'profile', profileId] as const,
}
