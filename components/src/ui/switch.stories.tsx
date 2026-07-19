import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Switch>

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6 text-foreground">
      {children}
    </div>
  )
}

function Stateful({
  initial = false,
  disabled = false,
  label,
}: {
  initial?: boolean
  disabled?: boolean
  label?: string
}) {
  const [on, setOn] = useState(initial)
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
      <Switch
        checked={on}
        onCheckedChange={setOn}
        disabled={disabled}
        aria-label={label}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}

export const Off: Story = {
  render: () => (
    <Panel>
      <Stateful initial={false} label="Off" />
    </Panel>
  ),
}

export const On: Story = {
  render: () => (
    <Panel>
      <Stateful initial={true} label="On" />
    </Panel>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <Stateful initial={false} disabled label="Disabled (off)" />
      <Stateful initial={true} disabled label="Disabled (on)" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <Panel>
      <Stateful initial={true} label="Enable dark mode" />
    </Panel>
  ),
}

/**
 * Switch is a single fixed size (36×20) per design — no size variants.
 * Story kept for visual reference at the default size.
 */
export const AllStates: Story = {
  render: () => (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <Stateful initial={false} label="Off" />
      <Stateful initial={true} label="On" />
      <Stateful initial={true} disabled label="Disabled" />
    </div>
  ),
}
