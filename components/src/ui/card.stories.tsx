import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content — use this surface to group related information with a
          subtle border and padded sections.
        </p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <Button variant="default" size="sm" className="self-start">Save</Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Header uses <code className="rounded bg-muted px-1">grid</code> layout
          so an action lands in the top-right column automatically.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Bare: Story = {
  render: () => (
    <Card className="w-80 p-4">
      A flat surface — pass <code className="rounded bg-muted px-1">className</code>
      to override padding, radius, or background.
    </Card>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Card className="w-64">
        <CardHeader><CardTitle>Default</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Standard surface.</p></CardContent>
      </Card>
      <Card className="w-64 border-destructive/40">
        <CardHeader><CardTitle>Destructive border</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Override <code className="rounded bg-muted px-1">border</code> via class.</p></CardContent>
      </Card>
      <Card className="w-64 bg-primary/5">
        <CardHeader><CardTitle>Tinted</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Tinted background for emphasis.</p></CardContent>
      </Card>
    </div>
  ),
}
