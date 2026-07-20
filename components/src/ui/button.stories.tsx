import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Mail, Search, Trash2 } from 'lucide-react'

import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'neutral', 'outline', 'chip', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'xs', 'lg', 'icon'] },
    asChild: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Button>

/* ── Variants ─────────────────────────────────────────────────────────── */

/** Default = tinted primary (pale fill + saturated primary border + text). */
export const Primary: Story = {
  args: { variant: 'default', children: 'Primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Destructive' },
}

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Neutral' },
}

/** Flat chip for one-of-N toggles — flip `aria-pressed` to see the selected tint. */
export const Chip: Story = {
  args: { variant: 'chip', children: 'Chip', 'aria-pressed': true },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

/* ── Sizes ────────────────────────────────────────────────────────────── */

export const Small: Story = {
  args: { variant: 'default', size: 'sm', children: 'Small' },
}

export const Medium: Story = {
  args: { variant: 'default', size: 'default', children: 'Medium' },
}

export const Large: Story = {
  args: { variant: 'default', size: 'lg', children: 'Large' },
}

export const ExtraSmall: Story = {
  args: { variant: 'default', size: 'xs', children: 'XS' },
}

export const Icon: Story = {
  args: { variant: 'default', size: 'icon', 'aria-label': 'Search', children: <Search /> },
}

/* ── States ───────────────────────────────────────────────────────────── */

export const Disabled: Story = {
  args: { variant: 'default', children: 'Disabled', disabled: true },
}

export const WithIcon: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: (<><Mail /> Inbox</>),
  },
}

/** asChild renders the variant styling on a child element (e.g. anchor). */
export const AsChild: Story = {
  args: {
    variant: 'outline',
    asChild: true,
    children: <a href="https://example.com">Anchor button</a>,
  },
}

/* ── Aggregators ──────────────────────────────────────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div className="bg-background text-foreground flex flex-wrap items-center gap-2 p-4">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="chip" aria-pressed>Chip</Button>
      <Button variant="destructive"><Trash2 /> Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="bg-background text-foreground flex flex-wrap items-center gap-2 p-4">
      <Button size="xs">XS</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Search"><Search /></Button>
    </div>
  ),
}
