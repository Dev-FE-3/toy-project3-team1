export const profileSharedQueryKeys = {
  all: ['profile'] as const,
  image: (userId: string | undefined) => [...profileSharedQueryKeys.all, 'image', userId] as const,
}
