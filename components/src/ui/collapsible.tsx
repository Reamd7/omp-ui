"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/utils";

const Collapsible = BaseCollapsible.Root;

type AsChildRenderProps = {
  render?: React.ReactElement;
  children?: React.ReactNode;
};

type TriggerProps = React.ComponentProps<typeof BaseCollapsible.Trigger> & { asChild?: boolean };

const CollapsibleTrigger = ({ className, asChild, children, ...props }: TriggerProps) => {
  const renderProps: AsChildRenderProps =
    asChild && React.isValidElement(children)
      ? { render: children as React.ReactElement }
      : { children };
  return (
    <BaseCollapsible.Trigger
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-foreground hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      {...props}
      {...renderProps}
    />
  );
};

const CollapsibleContent = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) => (
  <BaseCollapsible.Panel
    className={cn(
      "overflow-hidden",
      // tw-animate-css 提供的标准 fade + zoom 入场/出场（openchamber 原本的
      // animate-collapsible-up/down 是自定义 keyframes，这里替换为通用动画）。
      "data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95",
      "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
      className,
    )}
    {...props}
  />
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
