export const profileSharedQueryKeys = {
  all: ['profile'] as const,
  image: (userId: string) => [...profileSharedQueryKeys.all, 'image', userId] as const,
}
