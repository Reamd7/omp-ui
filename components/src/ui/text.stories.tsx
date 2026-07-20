import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "UI/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["static", "generate-effect", "glitch", "hover-enter", "shake", "hover-decoration"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Static: Story = {
  args: { variant: "static", children: "Static text — plain span, no animation." },
};

export const GenerateEffect: Story = {
  args: {
    variant: "generate-effect",
    children: "Generate effect — animated reveal driven by motion.",
  },
};

export const Glitch: Story = {
  args: {
    variant: "glitch",
    children: "Glitch text",
  },
};

export const HoverEnter: Story = {
  args: { variant: "hover-enter", children: "Hover for enter animation" },
};

export const Shake: Story = {
  args: { variant: "shake", children: "Shake" },
};

export const HoverDecoration: Story = {
  args: { variant: "hover-decoration", children: "Hover for decoration" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3 text-foreground">
      <Text {...args} variant="static">
        static
      </Text>
      <Text {...args} variant="generate-effect">
        generate-effect
      </Text>
      <Text {...args} variant="glitch">
        glitch
      </Text>
      <Text {...args} variant="hover-enter">
        hover-enter (hover me)
      </Text>
      <Text {...args} variant="shake">
        shake
      </Text>
      <Text {...args} variant="hover-decoration">
        hover-decoration (hover me)
      </Text>
    </div>
  ),
};

export const CustomClassName: Story = {
  args: {
    variant: "static",
    children: "Custom styled text",
    className: "text-2xl font-bold text-primary",
  },
};
