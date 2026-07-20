import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarGroupProps {
  /** Group display label (e.g. "business", "automation-ai") */
  label: string;
  /** Number of items in this group */
  count: number;
  /** Unique storage key prefix for persisting collapse state */
  storageKey: string;
  /** Whether to start expanded. @default true */
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
}

function getStorageKey(storageKey: string, label: string): string {
  return `omp-web:sidebar-group:${storageKey}:${label}`;
}

/**
 * Collapsible sidebar group with persisted expand/collapse state.
 *
 * Migrated from openchamber sections/shared/SidebarGroup.tsx.
 * Decoupling changes:
 *   - <Icon name="arrow-down-s" /> → <ChevronDown /> from lucide-react
 *   - localStorage key prefix: `opencode:` → `omp-web:`
 *
 * Used in Agents and Skills sidebars to group items by subfolder.
 */
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  count,
  storageKey,
  defaultExpanded = true,
  children,
  className,
}) => {
  const key = getStorageKey(storageKey, label);
  const contentId = React.useId();

  const [expanded, setExpanded] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return stored === "true";
    } catch {
      // ignore storage errors
    }
    return defaultExpanded;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, String(expanded));
    } catch {
      // ignore storage errors
    }
  }, [key, expanded]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className={cn(
          "flex w-full items-center gap-1 rounded-md px-2 py-1 text-left",
          "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
          "transition-colors duration-150 hover:bg-[var(--interactive-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        )}
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200",
            !expanded && "-rotate-90",
          )}
        />
        <span className="flex-1 truncate">{label}</span>
        <span className="ml-1 tabular-nums opacity-60">{count}</span>
      </button>

      <div
        id={contentId}
        hidden={!expanded}
        className="mt-0.5 ml-2 space-y-0.5 border-l-2 border-[var(--interactive-border)] pl-3"
      >
        {children}
      </div>
    </div>
  );
};
