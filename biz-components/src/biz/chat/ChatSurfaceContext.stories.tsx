import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatSurfaceProvider, useChatSurface } from "./ChatSurfaceContext";

const meta = {
  title: "Biz/Chat/ChatSurfaceContext",
  component: ChatSurfaceProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChatSurfaceProvider>;

export default meta;
type Story = StoryObj<typeof ChatSurfaceProvider>;

/** 用一个子组件把 context 值显示出来 */
function SurfaceIndicator() {
  const mode = useChatSurface();
  const color =
    mode === "full"
      ? "text-primary"
      : mode === "mini"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground">useChatSurface() →</span>
      <span className={`text-2xl font-bold ${color}`}>{mode}</span>
    </div>
  );
}

export const Full: Story = {
  render: () => (
    <ChatSurfaceProvider mode="full">
      <SurfaceIndicator />
    </ChatSurfaceProvider>
  ),
};

export const Mini: Story = {
  render: () => (
    <ChatSurfaceProvider mode="mini">
      <SurfaceIndicator />
    </ChatSurfaceProvider>
  ),
};

export const Overlay: Story = {
  render: () => (
    <ChatSurfaceProvider mode="overlay">
      <SurfaceIndicator />
    </ChatSurfaceProvider>
  ),
};

export const NoProviderDefaultsToFull: Story = {
  render: () => <SurfaceIndicator />,
};
