import { Category } from "../model/types";

export const homePageQueryKeys = {
  all: ['homePage'] as const, // 최상위 네임스페이스
  playlists: (category?: Category) => [...homePageQueryKeys.all, 'playlists', category] as const,
}
