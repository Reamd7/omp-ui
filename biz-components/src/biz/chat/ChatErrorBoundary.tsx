import * as React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * ChatErrorBoundary — isolates chat surface crashes so the rest of the app stays usable.
 *
 * Migrated from openchamber chat/ChatErrorBoundary.tsx.
 * Decoupling changes:
 *   - i18n hook → hardcoded English texts (biz 边界：无 i18n)
 *   - <Icon name="chat-3" /> → <AlertTriangle /> from lucide-react
 *   - <Icon name="restart" /> → <RotateCcw /> from lucide-react
 *
 * App layer can wrap this with its own i18n boundary if needed.
 */

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ChatErrorBoundaryTexts {
  title: string;
  description: string;
  sessionLabel: string;
  detailsSummary: string;
  resetAction: string;
  persistentHint: string;
}

interface ChatErrorBoundaryViewProps extends ChatErrorBoundaryProps {
  texts: ChatErrorBoundaryTexts;
}

const DEFAULT_TEXTS: ChatErrorBoundaryTexts = {
  title: "Chat crashed",
  description: "Something went wrong while rendering this conversation.",
  sessionLabel: "Session",
  detailsSummary: "Error details",
  resetAction: "Try again",
  persistentHint: "If this keeps happening, reload the app or start a new session.",
};

class ChatErrorBoundaryView extends React.Component<
  ChatErrorBoundaryViewProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryViewProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    if (process.env.NODE_ENV === "development") {
      console.error("Chat error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {this.props.texts.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                {this.props.texts.description}
              </p>

              {this.props.sessionId && (
                <div className="text-center text-xs text-muted-foreground">
                  {this.props.texts.sessionLabel}: {this.props.sessionId}
                </div>
              )}

              {this.state.error && (
                <details className="rounded bg-muted p-3 font-mono text-xs">
                  <summary className="cursor-pointer hover:bg-interactive-hover/80">
                    {this.props.texts.detailsSummary}
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto">{this.state.error.toString()}</pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline" className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {this.props.texts.resetAction}
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                {this.props.texts.persistentHint}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  sessionId?: string;
  /** Override default English texts (e.g. from app-layer i18n). */
  texts?: Partial<ChatErrorBoundaryTexts>;
}

export function ChatErrorBoundary({ texts, ...rest }: ChatErrorBoundaryProps) {
  return <ChatErrorBoundaryView {...rest} texts={{ ...DEFAULT_TEXTS, ...texts }} />;
}
