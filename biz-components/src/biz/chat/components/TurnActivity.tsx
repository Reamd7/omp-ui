import * as React from "react";
import type { ContentChangeReason, StreamPhase } from "../types";

/**
 * Tool invocation record shown inside a turn's activity list.
 *
 * Migrated as a structural type — caller wires concrete fields.
 * (openchamber's lib/turns/types.ts TurnActivityRecord has ~20 fields; biz
 * version leaves the shape open and lets consumers extend.)
 */
export interface TurnActivityRecord {
  /** Stable tool-call id. */
  id: string;
  /** Caller-defined payload (tool name, args, status, ...). */
  [key: string]: unknown;
}

/**
 * Content shown when a tool wants to surface a popup (e.g. full output dialog).
 * Caller-defined shape — biz-components only carries it through.
 */
type ToolPopupContent = unknown;

interface TurnActivityProps {
  /**
   * Render-prop for the actual activity group UI.
   *
   * biz-components does NOT bundle openchamber's 37 KB ProgressiveGroup
   * component (its coupling exceeds Phase 1 scope). Callers pass their own
   * renderer — the prop signature mirrors ProgressiveGroup so an existing
   * impl can be dropped in unchanged.
   */
  renderGroup: (props: TurnActivityRenderProps) => React.ReactNode;
  parts: TurnActivityRecord[];
  isExpanded: boolean;
  collapsedPreviewCount?: number;
  onToggle: () => void;
  isMobile: boolean;
  expandedTools: Set<string>;
  onToggleTool: (toolId: string) => void;
  onShowPopup: (content: ToolPopupContent) => void;
  onContentChange?: (reason?: ContentChangeReason) => void;
  streamPhase: StreamPhase;
  showHeader: boolean;
  animateRows?: boolean;
  animatedToolIds?: Set<string>;
  diffStats?: { additions: number; deletions: number; files: number };
  renderJustificationActions?: (activity: TurnActivityRecord) => React.ReactNode;
}

export type TurnActivityRenderProps = Omit<TurnActivityProps, "renderGroup">;

/**
 * Thin forwarder — TurnActivity in openchamber just spreads props into
 * ProgressiveGroup. Here we let the caller wire that renderer, keeping
 * biz-components free of the 37 KB dependency.
 *
 * Migrated from openchamber chat/components/TurnActivity.tsx.
 */
const TurnActivity: React.FC<TurnActivityProps> = (props) => {
  const { renderGroup, ...rest } = props;
  return <>{renderGroup(rest)}</>;
};

export default React.memo(TurnActivity);
