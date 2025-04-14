import { z } from 'zod'

// === Form Validation Schema ===
export const playlistFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(20, '제목은 20자를 초과할 수 없습니다.'),
  description: z.string().max(150, '설명은 150자를 초과할 수 없습니다.'),
  hashtags: z.array(z.string()).max(3, '해시태그는 최대 3개까지 추가할 수 있습니다.'),
  isPublic: z.boolean(),
  videos: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      thumbnailUrl: z.string(),
    }),
  ),
  thumbnail: z.instanceof(File).nullable(),
})

export type PlaylistFormValues = z.infer<typeof playlistFormSchema>

// === API Types ===
// DB 테이블의 profile_id는 실제로는 user의 ID를 참조합니다
type UserId = string
type ProfileId = UserId // profile_id는 실제로 user_id와 같은 값을 사용

export interface CreatePlaylistParams {
  title: string
  description?: string | null
  profile_id: ProfileId // 데이터베이스의 컬럼명을 유지하되, 실제로는 UserId
  thumbnail_url?: string | null
  is_public: boolean
  hashtag?: string[] | null
}

export interface UploadThumbnailParams {
  file: File
  userId: string
  playlistId: string
}

export interface UpdateThumbnailUrlParams {
  playlistId: string
  thumbnailUrl: string
}

export interface CreatePlaylistItemsParams {
  playlistId: string
  videos: Video[]
}

// === Data Types ===
export interface Video {
  id: string // video_id를 의미
  title: string
  thumbnailUrl: string
}

// === UI Component Types ===
export type TabItemStatus = Record<string, boolean>

export interface BaseTabsState {
  tabStatus: TabItemStatus
  setTabStatus: (status: TabItemStatus) => void
  updateTabStatus: (key: string, value: boolean) => void
}

export interface TabsContextType<T extends string = string> {
  activeKey: T
  setActiveKey: (key: T) => void
  tabStatus: TabItemStatus
  setTabStatus: (status: TabItemStatus) => void
}

export interface TabItemProps {
  tabKey: string
  label: React.ReactNode
  isActive: boolean
  isComplete?: boolean
  onClick: () => void
  className?: string
}
