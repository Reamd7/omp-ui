import * as React from "react";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@components/ui/ErrorBoundary";

/**
 * Default sidebar widths (px). Callers can override per-instance via props.
 */
const DEFAULT_SIDEBAR_WIDTHS = {
  left: { content: 280, min: 280, max: 500 },
  right: { content: 420, min: 320, max: 720 },
} as const;

export type ResizableSidebarSide = "left" | "right";

interface ResizableSidebarProps {
  /** Which side the sidebar sits on — determines drag-handle position + defaults. */
  side: ResizableSidebarSide;
  /** Open state (caller-controlled). */
  isOpen: boolean;
  /** Persisted width in px (caller-controlled). When undefined, falls back to content default. */
  width?: number;
  /** Called with new width whenever the user finishes a drag. */
  onWidthChange?: (width: number) => void;
  /** Hide on mobile (caller decides — usually via device-info hook at app layer). */
  hideOnMobile?: boolean;
  /** Sidebar content. */
  children: React.ReactNode;
  /** Optional fixed strip above the scrollable area (e.g. toggle + project actions). */
  topBar?: React.ReactNode;
  /** Optional className on the outer <aside>. */
  className?: string;
  /** Width constraints override. */
  minWidth?: number;
  maxWidth?: number;
  /** Default width when `width` prop is undefined. */
  defaultWidth?: number;
  /** Resize-handle aria-label. @default "Resize sidebar" */
  resizeAriaLabel?: string;
}

/**
 * Resizable sidebar shell — pointer-drag width clamp.
 *
 * Migrated from openchamber layout/Sidebar.tsx + layout/RightSidebar.tsx,
 * merged into one component with a `side` prop. Decoupling changes:
 *   - UI store hook (sidebarWidth / rightSidebarWidth + setters) → controlled
 *     `width` + `onWidthChange` props
 *   - i18n hook → `resizeAriaLabel` prop (default: "Resize sidebar")
 *   - device-info hook (isMobile branch) → caller-controlled `hideOnMobile` prop
 *   - All clamp constants now configurable via minWidth/maxWidth/defaultWidth
 *
 * Architecture: live width tracked in a ref during drag (no re-render per
 * pointermove); state only commits on pointerup via onWidthChange.
 */
export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  side,
  isOpen,
  width,
  onWidthChange,
  hideOnMobile = false,
  children,
  topBar,
  className,
  minWidth,
  maxWidth,
  defaultWidth,
  resizeAriaLabel = "Resize sidebar",
}) => {
  const defaults = DEFAULT_SIDEBAR_WIDTHS[side];
  const min = minWidth ?? defaults.min;
  const max = maxWidth ?? defaults.max;
  const contentDefault = defaultWidth ?? defaults.content;

  const [isResizing, setIsResizing] = React.useState(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(width ?? contentDefault);
  const resizingWidthRef = React.useRef<number | null>(null);
  const activeResizePointerIDRef = React.useRef<number | null>(null);
  const sidebarRef = React.useRef<HTMLElement | null>(null);

  const clampWidth = React.useCallback(
    (value: number) => Math.min(max, Math.max(min, value)),
    [max, min],
  );

  const applyLiveWidth = React.useCallback(
    (nextWidth: number) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;
      const clamped = clampWidth(nextWidth);
      sidebar.style.width = `${clamped}px`;
      resizingWidthRef.current = clamped;
    },
    [clampWidth],
  );

  React.useEffect(() => {
    if (!isResizing) return;
    const preventSelection = (e: Event) => e.preventDefault();
    document.body.addEventListener("selectstart", preventSelection);
    return () => document.body.removeEventListener("selectstart", preventSelection);
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    // Reset inline width so the React-controlled width prop takes effect.
    sidebar.style.width = "";
    resizingWidthRef.current = null;
  }, [isResizing, width, isOpen]);

  if (hideOnMobile) {
    return null;
  }

  const openWidth = clampWidth(width ?? contentDefault);
  const appliedWidth = isOpen ? openWidth : 0;
  const currentWidth = isResizing ? (resizingWidthRef.current ?? appliedWidth) : appliedWidth;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    event.preventDefault();
    setIsResizing(true);
    startXRef.current = event.clientX;
    startWidthRef.current = width ?? openWidth;
    resizingWidthRef.current = startWidthRef.current;
    activeResizePointerIDRef.current = event.pointerId;
    (event.target as Element).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing || activeResizePointerIDRef.current !== event.pointerId) return;
    const delta = event.clientX - startXRef.current;
    const next = side === "left" ? startWidthRef.current + delta : startWidthRef.current - delta;
    applyLiveWidth(next);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeResizePointerIDRef.current !== event.pointerId) return;
    activeResizePointerIDRef.current = null;
    setIsResizing(false);
    const final = resizingWidthRef.current;
    if (final !== null && final !== undefined && final !== width) {
      onWidthChange?.(clampWidth(final));
    }
    resizingWidthRef.current = null;
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${currentWidth}px` }}
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-border/60 bg-background transition-[width] duration-150",
        side === "left" ? "border-r" : "border-l",
        !isOpen && "pointer-events-none",
        className,
      )}
    >
      {topBar !== null && topBar !== undefined ? <div className="shrink-0">{topBar}</div> : null}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>

      {/* Drag handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={resizeAriaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        className={cn(
          "absolute top-0 bottom-0 z-10 w-1 cursor-col-resize touch-none",
          side === "left" ? "right-0 -mr-px" : "left-0 -ml-px",
          "bg-transparent hover:bg-primary/20 active:bg-primary/40",
          isResizing && "bg-primary/40",
        )}
      />
    </aside>
  );
};
