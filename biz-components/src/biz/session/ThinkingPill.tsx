import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ThinkingPillProps {
  /** Currently selected value (empty string = default). */
  value: string;
  /** Available variants (excluding the implicit default). */
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
  /** Label for the "default" option (empty value). @default "Default" */
  defaultLabel?: string;
}

/**
 * Pill-shaped dropdown for picking a "thinking mode" variant.
 *
 * Migrated from openchamber session/ThinkingPill.tsx.
 * Decoupling changes:
 *   - i18n hook → `defaultLabel` prop (default: "Default")
 *   - <Icon name="arrow-down-s" /> → <ChevronDown /> from lucide-react
 *   - typography.micro / typography.meta → text-[11px] / text-xs
 */
export const ThinkingPill: React.FC<ThinkingPillProps> = ({
  value,
  options,
  disabled,
  onChange,
  defaultLabel = "Default",
}) => {
  const label = value || defaultLabel;

  const trigger = (
    <div
      className={cn(
        "flex h-6 w-fit items-center gap-1.5 rounded-lg border border-border/20 bg-[var(--interactive-selection)]/20 px-2",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:bg-[var(--interactive-hover)]/30",
      )}
    >
      <span className="whitespace-nowrap text-[11px] font-medium capitalize">{label}</span>
      <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
    </div>
  );

  if (disabled) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-[220px]" portalToBody>
        <DropdownMenuItem className="text-xs" onSelect={() => onChange("")}>
          <span className={cn("font-medium", !value && "text-primary")}>{defaultLabel}</span>
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem key={option} className="text-xs" onSelect={() => onChange(option)}>
            <span className={cn("font-medium capitalize", value === option && "text-primary")}>
              {option}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
