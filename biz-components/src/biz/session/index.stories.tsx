import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ThinkingPill } from "./ThinkingPill";
import { ArchiveAllDropdown } from "./ArchiveAllDropdown";

const meta = {
  title: "Biz/Session",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ThinkingPillDefault: Story = {
  name: "ThinkingPill — Default",
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="flex flex-col items-start gap-4 p-6">
        <p className="text-xs text-muted-foreground">
          Current value: <code className="font-mono">{value || "(default)"}</code>
        </p>
        <ThinkingPill value={value} options={["Think", "Reason", "Plan"]} onChange={setValue} />
      </div>
    );
  },
};

export const ThinkingPillDisabled: Story = {
  name: "ThinkingPill — Disabled",
  render: () => (
    <div className="p-6">
      <ThinkingPill value="Think" options={["Think", "Reason"]} disabled onChange={() => {}} />
    </div>
  ),
};

export const ArchiveAll: Story = {
  name: "ArchiveAllDropdown",
  render: () => {
    const [lastAction, setLastAction] = React.useState("(none)");
    return (
      <div className="flex flex-col items-start gap-3 p-6">
        <p className="text-xs text-muted-foreground">
          Last action: <code className="font-mono">{lastAction}</code>
        </p>
        <ArchiveAllDropdown onArchiveAll={() => setLastAction("archive-all")} />
      </div>
    );
  },
};
