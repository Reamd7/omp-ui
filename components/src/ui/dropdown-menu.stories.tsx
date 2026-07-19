import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  ChevronDown,
  ClipboardPaste,
  Copy,
  Edit,
  Folder,
  Scissors,
  Share,
  Trash,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

function TriggerButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent"
    >
      {label}
      <ChevronDown className="size-4 opacity-70" />
    </button>
  )
}

/** A flat list of menu items with destructive variant + inset. */
function ItemsDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton label="Actions" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Edit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <Trash />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem inset>Inset item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Nested submenu using DropdownMenuSub. */
function SubmenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton label="Open menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Copy />
          Copy
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share />
            Share
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Send via message</DropdownMenuItem>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <Edit />
          Rename
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Items grouped by a label + separator. */
function SeparatorDemo() {
  const [filter, setFilter] = useState('all')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton label="View" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuItem>Name</DropdownMenuItem>
        <DropdownMenuItem>Date modified</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filter} onValueChange={(v) => setFilter(String(v))}>
          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Items that lead with a lucide icon. */
function WithIconsDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton label="Edit" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Folder />
          Open folder
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Copy path
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Scissors />
          Cut
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ClipboardPaste />
          Paste
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Items showing a keyboard shortcut hint on the right. */
function WithShortcutDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton label="Edit" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Scissors />
          <span>Cut</span>
          <span className="ml-auto text-xs text-muted-foreground">⌘X</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          <span>Copy</span>
          <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ClipboardPaste />
          <span>Paste</span>
          <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Items: Story = { render: () => <ItemsDemo /> }
export const Submenu: Story = { render: () => <SubmenuDemo /> }
export const Separator: Story = { render: () => <SeparatorDemo /> }
export const WithIcons: Story = { render: () => <WithIconsDemo /> }
export const WithShortcut: Story = { render: () => <WithShortcutDemo /> }

/** Aggregated view of the most common shapes for quick visual reference. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <ItemsDemo />
      <SubmenuDemo />
      <WithIconsDemo />
      <WithShortcutDemo />
    </div>
  ),
}
