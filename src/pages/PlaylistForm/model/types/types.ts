import { z } from 'zod'

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

export interface Video {
  id: string
  title: string
  url: string
  thumbnailUrl: string
}

// 탭 아이템 상태 타입 정의
export type TabItemStatus = Record<string, boolean>

// 기본 탭 상태 인터페이스
export interface BaseTabsState {
  tabStatus: TabItemStatus
  setTabStatus: (status: TabItemStatus) => void
  updateTabStatus: (key: string, value: boolean) => void
}

// 제네릭 탭 컨텍스트 타입
export interface TabsContextType<T extends string = string> {
  activeKey: T
  setActiveKey: (key: T) => void
  tabStatus: TabItemStatus
  setTabStatus: (status: TabItemStatus) => void
}

// 탭 아이템 프로퍼티 타입
export interface TabItemProps {
  tabKey: string
  label: React.ReactNode
  isActive: boolean
  isComplete?: boolean
  onClick: () => void
  className?: string
}
