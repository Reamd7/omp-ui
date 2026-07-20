"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { ArrowUp, Command as CommandIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollableOverlay } from "./ScrollableOverlay";

function Command({ className, style, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      // Let the parent (DropdownMenuContent, DialogContent, etc.) paint the
      // background and provide elevation. Overriding bg here would cover the
      // parent's inset shadows (our inner light ring) and flatten the edge.
      style={{
        color: "var(--card-foreground)",
        ...style,
      }}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  return (
    <div data-slot="command-input-wrapper" className="flex h-8 items-center gap-2 border-b px-3">
      <Search className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={cn(
          "flex h-8 w-full rounded-lg bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = "CommandInput";

function CommandList({
  className,
  children,
  scrollbarClassName,
  disableHorizontal,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List> & {
  scrollbarClassName?: string;
  disableHorizontal?: boolean;
}) {
  return (
    <ScrollableOverlay
      as={CommandPrimitive.List}
      data-slot="command-list"
      outerClassName="max-h-[min(600px,calc(100vh-10rem))] h-full min-h-0 w-full overflow-x-hidden p-0"
      className={cn("h-full min-h-0 scroll-py-1 overflow-x-hidden", className)}
      scrollbarClassName={
        scrollbarClassName ??
        "overlay-scrollbar--flush overlay-scrollbar--dense overlay-scrollbar--zero"
      }
      disableHorizontal={disableHorizontal ?? true}
      {...props}
    >
      {children}
    </ScrollableOverlay>
  );
}

function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[highlighted]:bg-interactive-hover data-[selected=true]:bg-interactive-selection data-[selected=true]:text-interactive-selection-foreground hover:bg-interactive-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  const renderKey = (keyLabel: string) => {
    const normalized = keyLabel.trim().toLowerCase();

    if (normalized === "ctrl" || normalized === "control") {
      return <span className="text-xs font-medium">ctrl</span>;
    }

    if (
      normalized === "cmd" ||
      normalized === "⌘" ||
      normalized === "command" ||
      normalized === "meta"
    ) {
      return <CommandIcon className="size-3.5" />;
    }

    if (normalized === "shift" || normalized === "⇧") {
      return <ArrowUp className="size-3.5" />;
    }

    return <span className="text-xs font-medium">{keyLabel}</span>;
  };

  const shortcutText = typeof props.children === "string" ? props.children : "";

  const tokens = shortcutText
    ? shortcutText
        .split("+")
        .map((token) => token.trim())
        .filter(Boolean)
    : [];

  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto flex items-center gap-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      {tokens.length > 0
        ? tokens.map((token, index) => (
            <React.Fragment key={`${token}-${index}`}>
              {index > 0 && <span className="text-xs opacity-60">+</span>}
              {renderKey(token)}
            </React.Fragment>
          ))
        : props.children}
    </span>
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
