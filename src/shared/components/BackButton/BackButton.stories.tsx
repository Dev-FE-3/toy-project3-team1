import type { Meta, StoryObj } from '@storybook/react'
import BackButton from './BackButton'
import { MemoryRouter } from 'react-router-dom'

const meta: Meta<typeof BackButton> = {
  title: 'Shared/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof BackButton>

export const Default: Story = {}
