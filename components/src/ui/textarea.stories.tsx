import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Write something…',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    simple: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Write something…' },
}

export const Disabled: Story = {
  args: { defaultValue: 'Cannot edit this', disabled: true },
}

export const WithValue: Story = {
  args: {
    defaultValue:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
}

export const HasError: Story = {
  args: { defaultValue: 'invalid input', hasError: true },
}

/**
 * `simple` mode renders a bare textarea that grows to fit its content
 * (CSS `field-sizing: content`). Drop it inside any styled composer.
 */
export const SimpleAutoResize: Story = {
  render: () => (
    <div className="bg-background text-foreground w-96 rounded-lg border border-border/60 p-3">
      <Textarea
        simple
        placeholder="Type to see me grow… (line breaks expand the box)"
      />
    </div>
  ),
}

/**
 * Compound (default) textarea exposes a drag handle in the bottom-right
 * corner; pull it to resize. Height floor is 82px.
 */
export const Resizable: Story = {
  render: () => (
    <div className="bg-background text-foreground w-96 p-4">
      <Textarea defaultValue="Drag the handle in the bottom-right corner to resize me." />
    </div>
  ),
}
