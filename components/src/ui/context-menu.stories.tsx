import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Copy, Folder, Trash } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "UI/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const triggerSurfaceClass =
  "flex h-40 w-80 items-center justify-center rounded-lg border border-border bg-background text-sm text-muted-foreground select-none";

/** Right-click anywhere on the surface to open the menu. */
function BasicDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={triggerSurfaceClass}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Copy />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>
          <Folder />
          Open in folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/** Menu with multiple separators and grouped sections. */
function NestedDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={triggerSurfaceClass}>
        Right-click for the full menu
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Copy />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const Basic: Story = {
  render: () => <BasicDemo />,
};

export const Nested: Story = {
  render: () => <NestedDemo />,
};

/** Aggregated view of the basic and nested variants. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <BasicDemo />
      <NestedDemo />
    </div>
  ),
};
