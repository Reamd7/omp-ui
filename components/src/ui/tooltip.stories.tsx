import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Info } from 'lucide-react'

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Tooltip>

function TooltipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-32 w-72 items-center justify-center rounded-lg border border-border bg-background p-6 text-foreground">
      {children}
    </div>
  )
}

/** Hover the trigger to reveal — uses a controlled inner state for demo clarity. */
function StatefulTooltip({
  content = 'I am a tooltip',
  side = 'top',
  sideOffset,
  align,
}: {
  content?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              Hover me
            </button>
          }
        />
        <TooltipContent side={side} sideOffset={sideOffset} align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const Default: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip />
    </TooltipBox>
  ),
}

/** 默认就带 arrow（base-ui Tooltip.Arrow 已内置）；这里显式标出。 */
export const WithArrow: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip content="Tooltip with an arrow ▲" side="bottom" />
    </TooltipBox>
  ),
}

export const SideTop: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip side="top" />
    </TooltipBox>
  ),
}

export const SideRight: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip side="right" />
    </TooltipBox>
  ),
}

export const SideBottom: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip side="bottom" />
    </TooltipBox>
  ),
}

export const SideLeft: Story = {
  render: () => (
    <TooltipBox>
      <StatefulTooltip side="left" />
    </TooltipBox>
  ),
}

export const DifferentSides: Story = {
  render: () => (
    <TooltipBox>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <StatefulTooltip side="top" content="Top" />
        <StatefulTooltip side="right" content="Right" />
        <StatefulTooltip side="bottom" content="Bottom" />
        <StatefulTooltip side="left" content="Left" />
      </div>
    </TooltipBox>
  ),
}

/** 自定义 trigger — 这里用 lucide-react 的 Info 图标按钮。 */
export const CustomTrigger: Story = {
  render: () => (
    <TooltipBox>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                aria-label="More info"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-interactive-hover"
              >
                <Info className="size-4" />
              </button>
            }
          />
          <TooltipContent side="right">
            Custom icon trigger — info tooltip on the right.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TooltipBox>
  ),
}

/** Controlled (open state externalized) example with a click toggle. */
export const Controlled: Story = {
  render: () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <TooltipBox>
          <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger
                render={
                  <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                    {open ? 'Close' : 'Open'}
                  </button>
                }
              />
              <TooltipContent side="bottom">Externally controlled state</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TooltipBox>
      )
    }
    return <Controlled />
  },
}
