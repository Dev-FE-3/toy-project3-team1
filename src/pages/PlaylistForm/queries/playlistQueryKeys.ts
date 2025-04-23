export const playlistFormKeys = {
  all: ['playlistForm'],
  lists: () => [...playlistFormKeys.all, 'lists'],
  list: () => [...playlistFormKeys.lists()],
  details: () => [...playlistFormKeys.all, 'detail'],
  detail: (id: string) => [...playlistFormKeys.details(), id],
} as const
