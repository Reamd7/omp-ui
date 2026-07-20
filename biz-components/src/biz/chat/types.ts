/**
 * Shared chat types — local to biz-components (no @opencode-ai/sdk dependency).
 *
 * Migrated from openchamber chat/lib/turns/types.ts (subset).
 * The original types couple to @opencode-ai/sdk; biz-components uses a
 * generic message shape so callers wire their own SDK types in.
 */

export interface ChatMessageEntry {
  /** Stable message id. */
  id: string;
  /** Caller-defined message kind (e.g. 'user' | 'assistant'). */
  role?: string;
  /** Free-form payload — caller decides shape. */
  [key: string]: unknown;
}

export interface Turn {
  turnId: string;
  userMessage: ChatMessageEntry;
  assistantMessages: ChatMessageEntry[];
}

/**
 * Stream phase — used by chat surface components to indicate live vs final state.
 * Migrated as plain string literal (openchamber's lib/types version).
 */
export type StreamPhase = "streaming" | "tool" | "complete" | "error";

/**
 * Reason the chat content changed (auto-follow hook signal).
 * Inlined from openchamber's useChatAutoFollow to avoid pulling the hook.
 */
export type ContentChangeReason = "expand" | "collapse" | "stream" | "manual" | undefined;
