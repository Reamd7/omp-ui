import type { Meta, StoryObj } from "@storybook/react";
import { Placeholder, type PlaceholderProps } from "./Placeholder";

const meta = {
  title: "Biz/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Placeholder",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Placeholder size="sm" label="sm" />
      <Placeholder size="md" label="md" />
      <Placeholder size="lg" label="lg" />
    </div>
  ),
};

export const WithChildren: Story = {
  render: (args: PlaceholderProps) => (
    <Placeholder {...args} className="w-80">
      <p className="text-center text-xs opacity-60">内容放这里 —— 用来占位待实现的真实业务 UI</p>
    </Placeholder>
  ),
};
