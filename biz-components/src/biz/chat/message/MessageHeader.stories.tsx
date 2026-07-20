import type { Meta, StoryObj } from "@storybook/react";
import MessageHeader, { type AgentColor, type ProviderLogo } from "./MessageHeader";

const meta = {
  title: "Biz/Chat/MessageHeader",
  component: MessageHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof MessageHeader>;

export default meta;
type Story = StoryObj<typeof MessageHeader>;

const sampleAgentColors: Record<string, AgentColor> = {
  builder: { var: "--chart-3", class: "text-[var(--chart-3)]" },
  planner: { var: "--chart-1", class: "text-[var(--chart-1)]" },
};

export const UserMessage: Story = {
  args: {
    isUser: true,
    providerID: null,
    modelName: undefined,
    isDarkTheme: false,
  },
};

export const AssistantPlain: Story = {
  args: {
    isUser: false,
    providerID: "anthropic",
    modelName: "Claude Sonnet 4.5",
    isDarkTheme: false,
    resolveProviderLogo: () => ({ src: null, hasLogo: false }),
  },
};

export const AssistantWithAgentAndVariant: Story = {
  args: {
    isUser: false,
    providerID: "anthropic",
    agentName: "builder",
    modelName: "Claude Sonnet 4.5",
    variant: "Think",
    isDarkTheme: false,
    resolveProviderLogo: () => ({ src: null, hasLogo: false }),
    resolveAgentColor: (name: string | undefined) =>
      sampleAgentColors[name ?? ""] ?? { var: "--muted-foreground", class: "" },
  },
};

export const AssistantWithProviderLogo: Story = {
  args: {
    isUser: false,
    providerID: "openai",
    agentName: undefined,
    modelName: "GPT-5",
    isDarkTheme: false,
    resolveProviderLogo: (id: string | null): ProviderLogo => ({
      src:
        id === "openai"
          ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2310a37f'/></svg>"
          : null,
      hasLogo: id === "openai",
    }),
  },
};

export const AssistantDefaultVariant: Story = {
  args: {
    isUser: false,
    providerID: null,
    agentName: "planner",
    modelName: "GPT-5",
    variant: "Default",
    isDarkTheme: false,
    resolveAgentColor: (name: string | undefined) =>
      sampleAgentColors[name ?? ""] ?? { var: "--muted-foreground", class: "" },
  },
};
