import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Checkbox>

/** Stateful wrapper so the checkbox is interactive in Storybook. */
function Interactive({
  initial = false,
  indeterminate = false,
  disabled = false,
  label,
}: {
  initial?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string
}) {
  const [checked, setChecked] = useState(initial)
  return (
    <label
      className="flex items-center gap-2 text-sm text-foreground"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Checkbox
        checked={checked}
        onChange={setChecked}
        disabled={disabled}
        indeterminate={indeterminate}
        ariaLabel={label}
      />
      {label && <span>{label}</span>}
    </label>
  )
}

export const Unchecked: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
      <Interactive initial={false} label="Unchecked" />
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
      <Interactive initial={true} label="Checked" />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
      <Interactive indeterminate label="Indeterminate" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <Interactive initial={false} disabled label="Disabled (unchecked)" />
      <Interactive initial={true} disabled label="Disabled (checked)" />
      <Interactive indeterminate disabled label="Disabled (indeterminate)" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
      <Interactive initial={true} label="Subscribe to updates" />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <Interactive initial={false} label="Unchecked" />
      <Interactive initial={true} label="Checked" />
      <Interactive indeterminate label="Indeterminate" />
      <Interactive initial={false} disabled label="Disabled" />
    </div>
  ),
}
