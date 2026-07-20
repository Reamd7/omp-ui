import * as React from "react";
import type { ChatMessageEntry } from "../types";

interface TurnAssistantBlockProps {
  assistantMessages: ChatMessageEntry[];
  renderMessage: (message: ChatMessageEntry) => React.ReactNode;
}

/**
 * Renders a list of assistant messages within a turn (zero logic).
 *
 * Migrated from openchamber chat/components/TurnAssistantBlock.tsx (18 lines).
 * Zero business coupling.
 */
const TurnAssistantBlock: React.FC<TurnAssistantBlockProps> = ({
  assistantMessages,
  renderMessage,
}) => {
  return <div className="relative z-0">{assistantMessages.map((m) => renderMessage(m))}</div>;
};

export default React.memo(TurnAssistantBlock);
