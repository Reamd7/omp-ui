import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ResizableSidebar } from "./ResizableSidebar";

const meta = {
  title: "Biz/Layout",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * 两侧 sidebar 同时显示，独立 resize + open/close。
 */
export const BothSides: Story = {
  name: "ResizableSidebar — Both sides",
  render: () => {
    const [leftOpen, setLeftOpen] = React.useState(true);
    const [rightOpen, setRightOpen] = React.useState(true);
    const [leftWidth, setLeftWidth] = React.useState<number | undefined>(320);
    const [rightWidth, setRightWidth] = React.useState<number | undefined>(480);

    return (
      <div className="flex h-[600px] w-full border border-border">
        <ResizableSidebar
          side="left"
          isOpen={leftOpen}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          topBar={
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Left
              </span>
              <button
                type="button"
                onClick={() => setLeftOpen((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                {leftOpen ? "Close" : "Open"}
              </button>
            </div>
          }
        >
          <div className="p-3 text-xs text-muted-foreground">
            Drag the right edge to resize. Width: {leftWidth ?? "(default)"}px
          </div>
        </ResizableSidebar>

        <main className="flex flex-1 flex-col items-center justify-center gap-2 bg-muted/30">
          <span className="text-sm font-medium text-foreground">Main content</span>
          <span className="text-xs text-muted-foreground">Drag either sidebar edge →</span>
        </main>

        <ResizableSidebar
          side="right"
          isOpen={rightOpen}
          width={rightWidth}
          onWidthChange={setRightWidth}
          topBar={
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
              <button
                type="button"
                onClick={() => setRightOpen((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                {rightOpen ? "Close" : "Open"}
              </button>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Right
              </span>
            </div>
          }
        >
          <div className="p-3 text-xs text-muted-foreground">
            Drag the left edge to resize. Width: {rightWidth ?? "(default)"}px
          </div>
        </ResizableSidebar>
      </div>
    );
  },
};

export const Closed: Story = {
  name: "ResizableSidebar — Closed state",
  render: () => (
    <div className="flex h-[400px] w-full border border-border">
      <ResizableSidebar side="left" isOpen={false}>
        <div className="p-3 text-xs">Hidden content</div>
      </ResizableSidebar>
      <main className="flex flex-1 items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Sidebar closed (width=0)
      </main>
    </div>
  ),
};
