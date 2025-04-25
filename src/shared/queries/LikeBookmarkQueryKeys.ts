export const LikeBookmarkQueryKeys = {
  like: (playlistId?: string) => ['playlist_Liked', playlistId] as const,
  bookmark: (playlistId?: string) => ['playlist_Bookmarked', playlistId] as const,
} as const
