import * as React from "react";
import { User, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Agent color token — caller resolves agent name → CSS var + class.
 * Externalized from openchamber's lib/agentColors (which coupled to a
 * fixed agent registry). biz layer lets the caller decide.
 */
export interface AgentColor {
  /** CSS var name like `--agent-color-1` (without var() wrapper). */
  var: string;
  /** Tailwind/utility class string applied to the badge container. */
  class: string;
}

/**
 * Provider logo source — caller resolves provider id → img src + handlers.
 * Externalized from openchamber's provider-logo hook hook.
 */
export interface ProviderLogo {
  src: string | null;
  hasLogo: boolean;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

interface MessageHeaderProps {
  isUser: boolean;
  providerID: string | null;
  agentName?: string;
  modelName?: string;
  /** Variant / thinking-mode label (e.g. "Default", "Think"). */
  variant?: string;
  /** Caller-provided dark-theme flag (drives logo filter). */
  isDarkTheme: boolean;
  /**
   * Resolve provider id → logo info. Caller controls the logo registry;
   * returning { hasLogo: false } falls back to the agent-color bot icon.
   */
  resolveProviderLogo?: (providerID: string | null) => ProviderLogo;
  /**
   * Resolve agent name → color token. Caller controls the agent registry.
   * Returning a constant makes all badges use the same color.
   */
  resolveAgentColor?: (agentName: string | undefined) => AgentColor;
  /** User avatar label override. @default "You" */
  userLabel?: string;
  /** Assistant label fallback (when modelName missing). @default "Assistant" */
  assistantLabel?: string;
}

const DEFAULT_AGENT_COLOR: AgentColor = {
  var: "--muted-foreground",
  class: "",
};

/**
 * Chat message header: avatar + name + agent badge + variant badge.
 *
 * Migrated from openchamber chat/message/MessageHeader.tsx (~95 LOC).
 * Decoupling changes:
 *   - provider-logo hook hook → `resolveProviderLogo` callback prop
 *   - agent-color lib lib → `resolveAgentColor` callback prop
 *   - <Icon name="user-3" /> → <User /> from lucide-react
 *   - <Icon name="brain-ai-3" /> + <Icon name="ai-agent" /> → <Bot /> / <Sparkles />
 *   - typography.ui-header → text-base; typography.meta → text-xs
 *   - 'You' / 'Assistant' hardcoded → userLabel / assistantLabel props
 */
const MessageHeader: React.FC<MessageHeaderProps> = ({
  isUser,
  providerID,
  agentName,
  modelName,
  variant,
  isDarkTheme,
  resolveProviderLogo = () => ({ src: null, hasLogo: false }),
  resolveAgentColor = () => DEFAULT_AGENT_COLOR,
  userLabel = "You",
  assistantLabel = "Assistant",
}) => {
  const logo = resolveProviderLogo(providerID);
  const agentColor = resolveAgentColor(agentName);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {isUser ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {logo.hasLogo && logo.src ? (
                  <img
                    src={logo.src}
                    alt={`${providerID ?? "provider"} logo`}
                    className="h-4 w-4"
                    style={{
                      filter: isDarkTheme
                        ? "brightness(0.9) contrast(1.1) invert(1)"
                        : "brightness(0.9) contrast(1.1)",
                    }}
                    onError={logo.onError}
                  />
                ) : (
                  <Bot className="h-4 w-4" style={{ color: `var(${agentColor.var})` }} />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "text-base font-bold leading-none tracking-tight",
                isUser ? "text-primary" : "text-foreground",
              )}
            >
              {isUser ? userLabel : (modelName ?? assistantLabel)}
            </h3>
            {!isUser && agentName && (
              <div
                className={cn(
                  "flex cursor-default items-center gap-1 rounded px-1.5 py-0 text-xs",
                  "hover:bg-[var(--interactive-hover)]",
                  agentColor.class,
                )}
              >
                <Sparkles className="h-3 w-3 flex-shrink-0" />
                <span className="font-medium">{agentName}</span>
              </div>
            )}
            {!isUser && variant && (
              <div
                className={cn(
                  "flex cursor-default items-center gap-1 rounded px-1.5 py-0 text-xs",
                  variant === "Default" ? undefined : "text-primary",
                )}
                style={
                  variant === "Default"
                    ? ({
                        "--agent-color": "var(--muted-foreground)",
                        "--agent-color-bg": "var(--muted-foreground)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <Bot className="h-3 w-3 flex-shrink-0" />
                <span className="font-medium">
                  {variant.length > 0
                    ? (variant[0] ?? "").toLowerCase() + variant.slice(1)
                    : variant}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageHeader);
