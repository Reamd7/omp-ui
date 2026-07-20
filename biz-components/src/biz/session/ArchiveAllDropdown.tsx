import * as React from "react";
import { Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";

interface ArchiveAllDropdownProps {
  onArchiveAll?: () => void;
  /** aria-label + tooltip for the trigger button. @default "Archive all" */
  ariaLabel?: string;
  /** First (destructive) item label. @default "Archive all" */
  confirmLabel?: string;
  /** Cancel item label. @default "Cancel" */
  cancelLabel?: string;
}

/**
 * Icon-button dropdown for "archive all" destructive action.
 *
 * Migrated from openchamber session/ArchiveAllDropdown.tsx.
 * Decoupling changes:
 *   - i18n hook → 3 label props with English defaults
 *   - <Icon name="archive" /> → <Archive /> from lucide-react
 */
export const ArchiveAllDropdown: React.FC<ArchiveAllDropdownProps> = ({
  onArchiveAll,
  ariaLabel = "Archive all",
  confirmLabel = "Archive all",
  cancelLabel = "Cancel",
}) => {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={ariaLabel}
              className="inline-flex h-8 w-8 items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Archive className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <p>{ariaLabel}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem onSelect={onArchiveAll}>{confirmLabel}</DropdownMenuItem>
        <DropdownMenuItem>{cancelLabel}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
