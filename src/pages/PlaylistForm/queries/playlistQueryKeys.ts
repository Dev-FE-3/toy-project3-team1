export const playlistFormKeys = {
  all: ['playlistForm'] as const,
  lists: () => [...playlistFormKeys.all, 'lists'] as const,
  list: () => [...playlistFormKeys.lists()] as const,
  details: () => [...playlistFormKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistFormKeys.details(), id] as const,
}
