export const LikeBookmarkQueryKeys = {
  userLike: (playlistId?: string) => ['playlist_IsUserLike', playlistId] as const,
  likeCount: (playlistId?: string) => ['playlist_Likes', playlistId] as const,
  bookmarkCount: (playlistId?: string) => ['playlist_Bookmarks', playlistId] as const,
  userBookmark: (playlistId?: string) => ['playlist_IsUserBookmark', playlistId] as const,
} as const
