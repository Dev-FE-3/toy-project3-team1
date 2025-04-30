import type { Meta, StoryObj } from '@storybook/react'
import BottomNav from './BottomNav'
import { MemoryRouter } from 'react-router-dom'

const meta: Meta<typeof BottomNav> = {
  title: 'Shared/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/6hl7AlPosAqFepzHKMMEjz/%EB%A6%AC%ED%94%8C%EB%A0%88%EC%9D%B4-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=450-2071&t=VrE1ntCWHaL6TcxQ-1',
      label: '리플레이 카드 디자인',
    },
    docs: {
      description: {
        component: `
## 하단 네비게이션 컴포넌트

앱의 주요 페이지 간 이동을 위한 하단 네비게이션 바입니다.

### 특징
- React Router와 통합되어 페이지 라우팅 처리
- 현재 경로에 따른 활성화 상태 자동 처리
- 모바일 우선 디자인

### 사용법
\`\`\`tsx
import { BottomNav } from '@shared/components'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* 페이지 컨텐츠 */}
      </main>
      <BottomNav />
    </div>
  )
}
\`\`\`

### 지원하는 라우트
- \`/\` - 홈
- \`/playlist/new\` - 새 플레이리스트
- \`/playlists\` - 플레이리스트 목록
- \`/profile\` - 프로필
- \`/settings\` - 설정

### 접근성
- 키보드 탐색 지원 (Tab, Enter)
- ARIA 레이블 적용
- 활성 상태 표시
`,
      },
    },
    initialEntries: ['/'],
  },
  decorators: [
    (Story, context) => {
      const initialEntries = context.parameters?.initialEntries || ['/']
      return (
        <MemoryRouter initialEntries={initialEntries}>
          <Story />
        </MemoryRouter>
      )
    },
  ],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 하단 네비게이션 바입니다. 홈 탭이 활성화되어 있습니다.',
      },
    },
  },
}

export const HomeActive: Story = {
  parameters: {
    initialEntries: ['/'],
    docs: {
      description: {
        story: '홈 탭이 활성화된 상태입니다. 현재 사용자가 홈 페이지에 있음을 나타냅니다.',
      },
    },
  },
}

export const PlaylistNewActive: Story = {
  parameters: {
    initialEntries: ['/playlist/new'],
    docs: {
      description: {
        story:
          '새 플레이리스트 생성 탭이 활성화된 상태입니다. 사용자가 새 플레이리스트를 만들 수 있는 페이지에 있음을 나타냅니다.',
      },
    },
  },
}

export const PlaylistsActive: Story = {
  parameters: {
    initialEntries: ['/playlists'],
    docs: {
      description: {
        story:
          '플레이리스트 목록 탭이 활성화된 상태입니다. 사용자가 플레이리스트 목록 페이지에 있음을 나타냅니다.',
      },
    },
  },
}

export const ProfileActive: Story = {
  parameters: {
    initialEntries: ['/profile'],
    docs: {
      description: {
        story: '프로필 탭이 활성화된 상태입니다. 사용자가 프로필 페이지에 있음을 나타냅니다.',
      },
    },
  },
}

export const SettingsActive: Story = {
  parameters: {
    initialEntries: ['/settings'],
    docs: {
      description: {
        story: '설정 탭이 활성화된 상태입니다. 사용자가 설정 페이지에 있음을 나타냅니다.',
      },
    },
  },
}
