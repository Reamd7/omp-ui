import type { Meta, StoryObj } from "@storybook/react";
import { DiffIcon, McpIcon, StopIcon, FusionIcon, ArrowsMerge } from "./index";

const meta = {
  title: "Biz/Icons/OpenChamber",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * 全部 5 个 openchamber 自有图标（lucide-react 无对应物），网格展示。
 */
export const All: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-6 p-6">
      {[
        { name: "DiffIcon", Icon: DiffIcon, note: "Git merge/branch" },
        { name: "McpIcon", Icon: McpIcon, note: "MCP protocol" },
        { name: "StopIcon", Icon: StopIcon, note: "Stop / cancel" },
        { name: "FusionIcon", Icon: FusionIcon, note: "Merged runs" },
        { name: "ArrowsMerge", Icon: ArrowsMerge, note: "Branches converge" },
      ].map(({ name, Icon, note }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-4 text-center"
        >
          <Icon className="h-8 w-8 text-foreground" />
          <div className="text-xs font-medium text-foreground">{name}</div>
          <div className="text-[10px] text-muted-foreground">{note}</div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {[16, 24, 32, 48].map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <DiffIcon size={s} className="text-primary" />
          <span className="text-xs text-muted-foreground">{s}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <div className="flex gap-4">
      <McpIcon className="h-6 w-6 text-foreground" />
      <McpIcon className="h-6 w-6 text-primary" />
      <McpIcon className="h-6 w-6 text-destructive" />
      <McpIcon className="h-6 w-6 text-muted-foreground" />
    </div>
  ),
};
