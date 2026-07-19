import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NumberInput } from './number-input'

const meta: Meta<typeof NumberInput> = {
  title: 'UI/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    step: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof NumberInput>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | undefined>(5)
    return <NumberInput value={value} onValueChange={setValue} />
  },
}

/** Step of 0.1 forces decimal normalization; min=0 / max=10 clamps. */
export const MinMaxStep: Story = {
  render: () => {
    const [a, setA] = React.useState<number | undefined>(0)
    const [b, setB] = React.useState<number | undefined>(0.5)
    const [c, setC] = React.useState<number | undefined>(-5)
    return (
      <div className="bg-background text-foreground flex flex-col gap-3 p-4">
        <NumberInput value={a} onValueChange={setA} min={0} max={10} step={1} />
        <NumberInput value={b} onValueChange={setB} min={0} max={1} step={0.1} />
        <NumberInput value={c} onValueChange={setC} min={-100} max={100} step={5} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | undefined>(5)
    return <NumberInput value={value} onValueChange={setValue} disabled />
  },
}

/** Empty state shows the em-dash fallback (clear input on blur). */
export const Empty: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | undefined>(undefined)
    return <NumberInput value={value} onValueChange={setValue} />
  },
}
