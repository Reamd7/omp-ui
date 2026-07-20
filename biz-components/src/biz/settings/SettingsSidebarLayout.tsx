import * as React from "react";
import { ScrollableOverlay } from "@components/ui/ScrollableOverlay";
import { cn } from "@/lib/utils";

interface SettingsSidebarLayoutProps {
  /** Header content (typically SettingsSidebarHeader) */
  header?: React.ReactNode;
  /** Footer content (e.g., AboutSettings on mobile) */
  footer?: React.ReactNode;
  /** Main scrollable content */
  children: React.ReactNode;
  /** Additional className for the outer container */
  className?: string;
  /** Background style for the sidebar container. @default 'sidebar' */
  variant?: "sidebar" | "background";
}

/**
 * Standard layout wrapper for settings sidebars.
 * Provides consistent background, scrolling, and header/footer slots.
 *
 * Migrated from openchamber sections/shared/SettingsSidebarLayout.tsx.
 * Decoupling changes:
 *   - Removed `isVSCodeRuntime` branch (omp-web has no VSCode fork) →
 *     `variant='sidebar'` always uses `bg-muted`; `variant='background'` uses `bg-background`.
 *   - `var(--surface-muted)` → `var(--muted)` (alias of same value)
 *   - `var(--surface-background)` → `var(--background)`
 */

export const SettingsSidebarLayout: React.FC<SettingsSidebarLayoutProps> = ({
  header,
  footer,
  children,
  className,
  variant = "sidebar",
}) => {
  const scrollRef = React.useRef<HTMLElement | null>(null);
  const [showTopShadow, setShowTopShadow] = React.useState(false);
  const [showBottomShadow, setShowBottomShadow] = React.useState(false);

  const bgClass = variant === "background" ? "bg-background" : "bg-muted";
  const bgVar = variant === "background" ? "var(--background)" : "var(--muted)";

  const updateScrollShadows = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setShowTopShadow(false);
      setShowBottomShadow(false);
      return;
    }
    const canScroll = el.scrollHeight > el.clientHeight + 1;
    if (!canScroll) {
      setShowTopShadow(false);
      setShowBottomShadow(false);
      return;
    }
    setShowTopShadow(el.scrollTop > 1);
    setShowBottomShadow(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  React.useEffect(() => {
    updateScrollShadows();
  }, [children, updateScrollShadows]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateScrollShadows();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateScrollShadows]);

  return (
    <div className={cn("flex h-full flex-col", bgClass, className)}>
      {header}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <ScrollableOverlay
          ref={scrollRef as unknown as React.Ref<HTMLElement>}
          outerClassName="min-h-0 flex-1"
          className="space-y-0.5 overflow-x-hidden px-3 py-2"
        >
          {children}
        </ScrollableOverlay>

        {showTopShadow && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-4"
            style={{ background: `linear-gradient(to bottom, ${bgVar} 0%, transparent 100%)` }}
          />
        )}
        {showBottomShadow && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6"
            style={{ background: `linear-gradient(to top, ${bgVar} 0%, transparent 100%)` }}
          />
        )}
      </div>

      {footer}
    </div>
  );
};
