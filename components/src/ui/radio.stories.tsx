import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Radio } from './radio'

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Radio>

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6 text-foreground">
      {children}
    </div>
  )
}

/** 单个受控 radio。 */
export const Single: Story = {
  render: () => {
    function SingleRadio() {
      const [on, setOn] = useState(false)
      return (
        <Panel>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio checked={on} onChange={() => setOn(true)} ariaLabel="single" />
            <span className="text-sm">{on ? 'Selected' : 'Not selected'}</span>
          </div>
        </Panel>
      )
    }
    return <SingleRadio />
  },
}

/** 一组互斥 radio（同组只选一个）。 */
export const Group: Story = {
  render: () => {
    const options = ['Apple', 'Banana', 'Cherry']
    function RadioGroup() {
      const [value, setValue] = useState<string>('Banana')
      return (
        <Panel>
          <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: 0 }}>
            <legend className="mb-1 text-sm font-medium">Pick a fruit:</legend>
            {options.map((opt) => (
              <label
                key={opt}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Radio
                  checked={value === opt}
                  onChange={() => setValue(opt)}
                  ariaLabel={opt}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </fieldset>
        </Panel>
      )
    }
    return <RadioGroup />
  },
}

export const Disabled: Story = {
  render: () => (
    <Panel>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio checked={false} disabled onChange={() => {}} ariaLabel="disabled-off" />
        <span className="text-sm opacity-60">Disabled (off)</span>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio checked={true} disabled onChange={() => {}} ariaLabel="disabled-on" />
        <span className="text-sm opacity-60">Disabled (on)</span>
      </div>
    </Panel>
  ),
}

export const WithLabel: Story = {
  render: () => {
    function Labeled() {
      const [value, setValue] = useState<'yes' | 'no'>('yes')
      return (
        <Panel>
          <span className="text-sm font-medium">Enable notifications?</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio checked={value === 'yes'} onChange={() => setValue('yes')} ariaLabel="yes" />
              <span className="text-sm">Yes</span>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio checked={value === 'no'} onChange={() => setValue('no')} ariaLabel="no" />
              <span className="text-sm">No</span>
            </label>
          </div>
        </Panel>
      )
    }
    return <Labeled />
  },
}

export const AllStates: Story = {
  render: () => (
    <Panel>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio checked={false} onChange={() => {}} ariaLabel="off" />
        <span className="text-sm">Unchecked</span>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio checked={true} onChange={() => {}} ariaLabel="on" />
        <span className="text-sm">Checked</span>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Radio checked={true} disabled onChange={() => {}} ariaLabel="disabled" />
        <span className="text-sm opacity-60">Disabled (checked)</span>
      </div>
    </Panel>
  ),
}
