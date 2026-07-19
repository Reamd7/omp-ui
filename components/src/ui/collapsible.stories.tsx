import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronDown } from 'lucide-react'

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Collapsible>

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-80 rounded-lg border border-border bg-background p-4 text-foreground">
      {children}
    </div>
  )
}

const sampleContent = (
  <div className="text-sm text-muted-foreground">
    Collapsible content. Click the trigger again to hide this section. The animation
    uses tw-animate-css fade + zoom utilities on the panel.
  </div>
)

/** 默认 stateful —— 内部 useState 控制 open/close。 */
export const Default: Story = {
  render: () => {
    function Stateful() {
      const [open, setOpen] = useState(false)
      return (
        <Frame>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger>Toggle section</CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2">{sampleContent}</div>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      )
    }
    return <Stateful />
  },
}

/** trigger 自带 chevron 图标，open 时旋转。 */
export const WithTriggerIcon: Story = {
  render: () => {
    function WithIcon() {
      const [open, setOpen] = useState(false)
      return (
        <Frame>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger>
              <span>Details</span>
              <ChevronDown
                className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2">{sampleContent}</div>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      )
    }
    return <WithIcon />
  },
}

/** 默认 open 的状态，配合动画入场演示。 */
export const Animated: Story = {
  render: () => {
    function AnimatedDefault() {
      const [open, setOpen] = useState(true)
      return (
        <Frame>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger>
              <span>Animated panel (starts open)</span>
              <ChevronDown
                className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2">{sampleContent}</div>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      )
    }
    return <AnimatedDefault />
  },
}

/** 多个独立 section —— 用 asChild 让 trigger 复用自定义按钮。 */
export const MultipleSections: Story = {
  render: () => {
    function Sections() {
      const [a, setA] = useState(true)
      const [b, setB] = useState(false)
      return (
        <div
          className="w-80 rounded-lg border border-border bg-background p-4 text-foreground"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Collapsible open={a} onOpenChange={setA}>
            <CollapsibleTrigger>
              <span>Section A</span>
              <ChevronDown
                className={`size-4 transition-transform ${a ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 text-sm text-muted-foreground">Content for A.</div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible open={b} onOpenChange={setB}>
            <CollapsibleTrigger>
              <span>Section B</span>
              <ChevronDown
                className={`size-4 transition-transform ${b ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 text-sm text-muted-foreground">Content for B.</div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }
    return <Sections />
  },
}
