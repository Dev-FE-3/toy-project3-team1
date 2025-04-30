import type { Meta, StoryObj } from '@storybook/react'
import Avatar from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Shared/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xsmall', 'small', 'medium', 'large'],
    },
    children: { control: false },
  },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    size: 'small',
  },
}

export const XSmall: Story = {
  args: {
    size: 'xsmall',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const CustomChildren: Story = {
  args: {
    size: 'medium',
    children: (
      <span
        className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
        tabIndex={0}
        aria-label="커스텀 아바타"
      >
        AB
      </span>
    ),
  },
}
