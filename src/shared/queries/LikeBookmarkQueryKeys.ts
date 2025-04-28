export const LikeBookmarkQueryKeys = {
  userLike: (playlistId?: string) => ['playlist_IsUserLike', playlistId] as const,
  likeCount: (playlistId?: string) => ['playlist_Likes', playlistId] as const,
  bookmark: (playlistId?: string) => ['playlist_Bookmarked', playlistId] as const,
} as const
