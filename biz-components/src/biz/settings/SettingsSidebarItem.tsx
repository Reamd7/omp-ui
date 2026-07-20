import * as React from "react";
import { MoreVertical, type LucideIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SettingsSidebarItemAction {
  label: string;
  /** Lucide icon component (caller passes e.g. Copy, Trash2). */
  icon?: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
}

interface SettingsSidebarItemProps {
  title: React.ReactNode;
  metadata?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
  actions?: SettingsSidebarItemAction[];
  className?: string;
}

/**
 * Selectable sidebar item with optional action menu (per-item).
 *
 * Migrated from openchamber sections/shared/SettingsSidebarItem.tsx.
 * Decoupling changes:
 *   - <Icon name="more-2" /> → <MoreVertical /> from lucide-react
 *   - `action.icon: IconName` → `action.icon: LucideIcon` (caller passes the component)
 *   - `bg-interactive-selection` / `bg-interactive-hover` → kept as semantic CSS vars
 *     (defined in components/src/styles/design-system.css)
 */
export const SettingsSidebarItem: React.FC<SettingsSidebarItemProps> = ({
  title,
  metadata,
  selected = false,
  onSelect,
  icon,
  actions,
  className,
}) => {
  const hasActions = actions !== null && actions !== undefined && actions.length > 0;

  return (
    <div
      onClick={() => onSelect?.()}
      className={cn(
        "group flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5",
        selected
          ? "bg-[var(--interactive-selection)] text-[var(--interactive-selection-foreground)]"
          : "hover:bg-[var(--interactive-hover)]",
        onSelect && "cursor-pointer",
        className,
      )}
    >
      {icon !== null && icon !== undefined ? <span className="flex-shrink-0">{icon}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="min-w-0 truncate text-sm font-medium">{title}</span>
        {metadata !== null && metadata !== undefined ? (
          <span className="min-w-0 truncate text-xs text-muted-foreground">{metadata}</span>
        ) : null}
      </div>

      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="-mr-1 h-6 w-6 flex-shrink-0 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-20 w-fit">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <DropdownMenuItem
                  key={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={cn(action.destructive && "text-destructive focus:text-destructive")}
                >
                  {ActionIcon && <ActionIcon className="mr-px h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
