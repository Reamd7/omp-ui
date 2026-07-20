import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { className: "h-4 w-48" },
};

export const Circle: Story = {
  args: { className: "h-12 w-12 rounded-full" },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-lg" />
      <Skeleton className="h-16 w-24 rounded-xl" />
    </div>
  ),
};
