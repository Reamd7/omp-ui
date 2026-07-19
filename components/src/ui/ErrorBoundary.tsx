import React from "react"
import { RotateCcw, TriangleAlert } from "lucide-react"

import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  copied?: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo, copied: false })
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleCopy = async () => {
    const errorText = this.state.error ? String(this.state.error) : "Unknown error"
    const stack = this.state.error?.stack
      ? `\n\nStack:\n${this.state.error.stack}`
      : ""
    const componentStack = this.state.errorInfo?.componentStack
      ? `\n\nComponent stack:${this.state.errorInfo.componentStack}`
      : ""
    const payload = `${errorText}${stack}${componentStack}`

    try {
      await navigator.clipboard.writeText(payload)
      this.setState({ copied: true })
      window.setTimeout(() => {
        this.setState((prev) => (prev.copied ? { copied: false } : null))
      }, 1500)
    } catch (error) {
      console.error("Failed to copy error to clipboard:", error)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                <TriangleAlert className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                An unexpected error occurred while rendering this component.
              </p>

              {this.state.error && (
                <details className="rounded bg-muted p-3 font-mono text-xs">
                  <summary className="cursor-pointer hover:bg-interactive-hover/80">
                    Error details
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack
                      ? `\n\nComponent stack:${this.state.errorInfo.componentStack}`
                      : ""}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reload
                </Button>
                <Button
                  onClick={this.handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {this.state.copied ? "Copied" : "Copy error"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
