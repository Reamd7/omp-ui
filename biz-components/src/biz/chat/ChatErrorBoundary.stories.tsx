import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatErrorBoundary } from "./ChatErrorBoundary";

const meta = {
  title: "Biz/Chat/ChatErrorBoundary",
  component: ChatErrorBoundary,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChatErrorBoundary>;

export default meta;
type Story = StoryObj<typeof ChatErrorBoundary>;

/** 制造一个会抛错的子组件，演示 boundary 捕获。 */
function CrashOnMount(): React.ReactNode {
  React.useEffect(() => {
    throw new Error("Simulated chat render failure: failed to fetch session messages.");
  }, []);
  return null;
}

export const Default: Story = {
  render: () => (
    <div className="h-[480px] w-[640px] rounded-md border border-border">
      <ChatErrorBoundary sessionId="sess_abc123">
        <CrashOnMount />
      </ChatErrorBoundary>
    </div>
  ),
};

export const CustomTexts: Story = {
  render: () => (
    <div className="h-[480px] w-[640px] rounded-md border border-border">
      <ChatErrorBoundary
        sessionId="sess_xyz789"
        texts={{
          title: "聊天崩溃了",
          description: "渲染这段对话时遇到了问题。",
          sessionLabel: "会话",
          detailsSummary: "错误详情",
          resetAction: "重试",
          persistentHint: "如果反复出现，请刷新页面或新建会话。",
        }}
      >
        <CrashOnMount />
      </ChatErrorBoundary>
    </div>
  ),
};

export const NoSession: Story = {
  render: () => (
    <div className="h-[480px] w-[640px] rounded-md border border-border">
      <ChatErrorBoundary>
        <CrashOnMount />
      </ChatErrorBoundary>
    </div>
  ),
};
