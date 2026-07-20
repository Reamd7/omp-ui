import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    placeholder: "you@example.com",
  },
  argTypes: {
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "file", "url"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text…" },
};

export const Placeholder: Story = {
  args: { placeholder: "Search…" },
};

export const WithValue: Story = {
  args: { defaultValue: "hello@omp.dev", placeholder: "you@example.com" },
};

export const Disabled: Story = {
  args: { defaultValue: "disabled value", disabled: true },
};

/** `aria-invalid` triggers the destructive ring variant. */
export const Invalid: Story = {
  args: {
    defaultValue: "not-an-email",
    "aria-invalid": true,
    placeholder: "you@example.com",
  },
};

export const FileInput: Story = {
  args: { type: "file" },
};

export const PasswordInput: Story = {
  args: { type: "password", defaultValue: "supersecret", placeholder: "Password" },
};

export const AllStates: Story = {
  render: () => (
    <div className="bg-background text-foreground flex w-80 flex-col gap-3 p-4">
      <Input placeholder="Default" />
      <Input defaultValue="with value" />
      <Input defaultValue="disabled" disabled />
      <Input defaultValue="invalid" aria-invalid />
      <Input type="file" />
    </div>
  ),
};
