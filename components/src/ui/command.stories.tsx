import type { Meta, StoryObj } from "@storybook/react"
import {
  Calendar,
  File,
  HelpCircle,
  Home,
  Search,
  Settings,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta

type Story = StoryObj<typeof Command>

/**
 * Inline command palette — renders `<Command>` directly without any Dialog
 * wrapper so the structure can be inspected in isolation.
 */
export const Default: Story = {
  render: () => (
    <div className="flex h-80 w-[480px] items-start justify-center rounded-xl border bg-card text-card-foreground shadow-sm">
      <Command className="bg-card">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Home className="size-4" />
              <span>Home</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <User className="size-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="size-4" />
              <span>Settings</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Files">
            <CommandItem>
              <File className="size-4" />
              <span>Documents</span>
            </CommandItem>
            <CommandItem>
              <Calendar className="size-4" />
              <span>Calendar</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

/**
 * Grouped command list with shortcuts and separators across multiple sections.
 */
export const WithGroups: Story = {
  render: () => (
    <div className="flex h-96 w-[480px] items-start justify-center rounded-xl border bg-card text-card-foreground shadow-sm">
      <Command className="bg-card">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <Home className="size-4" />
              <span>Go Home</span>
              <CommandShortcut>ctrl+H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Search className="size-4" />
              <span>Search</span>
              <CommandShortcut>shift+⌘+P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem>
              <User className="size-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="size-4" />
              <span>Preferences</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem>
              <HelpCircle className="size-4" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem>
              <HelpCircle className="size-4" />
              <span>Report an issue</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

/**
 * Empty state — `<CommandEmpty>` shows when no items match the filter.
 */
export const WithEmptyState: Story = {
  render: () => (
    <div className="flex h-80 w-[480px] items-start justify-center rounded-xl border bg-card text-card-foreground shadow-sm">
      <Command className="bg-card">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  ),
}

/**
 * All structural sub-components in one palette for visual cross-reference.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex h-[28rem] w-[520px] items-start justify-center rounded-xl border bg-card text-card-foreground shadow-sm">
      <Command className="bg-card">
        <CommandInput placeholder="Try searching 'settings'..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>
              <Home className="size-4" />
              <span>Open home</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="size-4" />
              <span>Open settings</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <User className="size-4" />
              <span>View profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Files">
            <CommandItem>
              <File className="size-4" />
              <span>Documents</span>
            </CommandItem>
            <CommandItem>
              <Calendar className="size-4" />
              <span>Calendar</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}
