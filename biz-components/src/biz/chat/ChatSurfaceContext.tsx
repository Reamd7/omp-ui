import * as React from "react";
import {
  ChatSurfaceContext,
  useChatSurface,
  type ChatSurfaceMode,
} from "./chatSurfaceContextValue";

// Re-export so consumers can `import { ChatSurfaceContext, useChatSurface }`
// from either this module or chatSurfaceContextValue.
export { ChatSurfaceContext, useChatSurface };

/**
 * ChatSurfaceProvider — top-level context provider that tags the current
 * chat rendering surface (full / mini / overlay).
 *
 * Migrated from openchamber chat/ChatSurfaceContext.tsx.
 * Trivial 1-prop provider; no business coupling.
 */
export const ChatSurfaceProvider: React.FC<{
  mode: ChatSurfaceMode;
  children: React.ReactNode;
}> = ({ mode, children }) => {
  return <ChatSurfaceContext.Provider value={mode}>{children}</ChatSurfaceContext.Provider>;
};
