import * as React from "react";
import type { ChatMessageEntry, Turn } from "../types";
import TurnAssistantBlock from "./TurnAssistantBlock";

interface TurnItemProps {
  turn: Turn;
  /** @default true */
  stickyUserHeader?: boolean;
  renderMessage: (message: ChatMessageEntry) => React.ReactNode;
}

/**
 * One user→assistant turn inside a chat surface.
 *
 * Migrated from openchamber chat/components/TurnItem.tsx (37 lines).
 * Zero business coupling — pure render-prop container.
 *
 * Note: `var(--surface-background)` replaced with `var(--background)`
 * (no separate surface-background token in biz theme).
 */
const TurnItem: React.FC<TurnItemProps> = ({ turn, stickyUserHeader = true, renderMessage }) => {
  return (
    <section
      className="relative w-full"
      id={`turn-${turn.turnId}`}
      data-turn-id={turn.turnId}
      data-scroll-spy-id={turn.turnId}
    >
      {stickyUserHeader ? (
        <div className="relative [overflow-anchor:none] sticky top-0 z-20 bg-[var(--background)]">
          <div className="relative z-10">{renderMessage(turn.userMessage)}</div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full z-0 h-4 bg-gradient-to-b from-[var(--background)] to-transparent sm:h-8"
          />
        </div>
      ) : (
        renderMessage(turn.userMessage)
      )}

      <TurnAssistantBlock
        assistantMessages={turn.assistantMessages}
        renderMessage={renderMessage}
      />
    </section>
  );
};

export default React.memo(TurnItem);
