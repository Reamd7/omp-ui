import type { Meta, StoryObj } from 'storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary', children: 'Primary' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Destructive' } }

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Disabled', disabled: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

/** 所有变体同框对照（用 dark theme 切换查看深色效果） */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="destructive">Destructive</Button>
    </div>
  ),
}
