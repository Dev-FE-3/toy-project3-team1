import type { Meta, StoryObj } from '@storybook/react'
import BottomNav from './BottomNav'
import { MemoryRouter } from 'react-router-dom'

const meta: Meta<typeof BottomNav> = {
  title: 'Shared/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
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
  parameters: {
    initialEntries: ['/'],
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HomeActive: Story = {
  parameters: { initialEntries: ['/'] },
}

export const PlaylistNewActive: Story = {
  parameters: { initialEntries: ['/playlist/new'] },
}

export const PlaylistsActive: Story = {
  parameters: { initialEntries: ['/playlists'] },
}

export const ProfileActive: Story = {
  parameters: { initialEntries: ['/profile'] },
}

export const SettingsActive: Story = {
  parameters: { initialEntries: ['/settings'] },
}
