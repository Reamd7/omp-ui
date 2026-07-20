import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToBottomButtonProps {
  visible: boolean;
  onClick: () => void;
  /** @default "Scroll to bottom" */
  ariaLabel?: string;
}

/**
 * Floating "scroll to bottom" pill that fades in/out based on list scroll position.
 *
 * Migrated from openchamber chat/components/ScrollToBottomButton.tsx.
 * Decoupling changes:
 *   - i18n hook → `ariaLabel` prop (default: "Scroll to bottom")
 *   - <Icon name="arrow-down" /> → <ArrowDown /> from lucide-react
 */
const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  visible,
  onClick,
  ariaLabel = "Scroll to bottom",
}) => {
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transition-all duration-150",
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-2 scale-95 opacity-0",
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        aria-label={ariaLabel}
        className="size-8 rounded-full [corner-shape:round] bg-background/95 p-0 shadow-none hover:bg-interactive-hover"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default React.memo(ScrollToBottomButton);
