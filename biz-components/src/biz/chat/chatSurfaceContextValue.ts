import * as React from "react";

/**
 * ChatSurfaceMode — where this chat UI is being rendered.
 *
 * - "full"    : primary chat in main layout
 * - "mini"    : mini-chat floating window
 * - "overlay" : embedded overlay panel
 *
 * Components downstream (MessageList, ChatInput, etc.) use this to switch
 * density / mobile affordances without prop-drilling.
 *
 * Migrated from openchamber chat/chatSurfaceContextValue.ts.
 */
export type ChatSurfaceMode = "full" | "mini" | "overlay";

export const ChatSurfaceContext = React.createContext<ChatSurfaceMode>("full");

/**
 * useChatSurface — read the current surface mode.
 *
 * Defaults to "full" when no provider is mounted (e.g. isolated Storybook story).
 */
export function useChatSurface(): ChatSurfaceMode {
  return React.useContext(ChatSurfaceContext);
}
