import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { Button } from "./button"
import { ErrorBoundary } from "./ErrorBoundary"

const meta: Meta<typeof ErrorBoundary> = {
  title: "UI/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta

type Story = StoryObj<typeof ErrorBoundary>

/**
 * Default state — the boundary renders its children untouched when nothing
 * throws.
 */
export const Default: Story = {
  render: () => (
    <div className="flex min-h-64 w-full items-center justify-center bg-background p-4 text-foreground">
      <ErrorBoundary>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Children rendered normally.</span>
          <span className="text-xs text-muted-foreground">
            No error thrown — boundary is invisible.
          </span>
        </div>
      </ErrorBoundary>
    </div>
  ),
}

/**
 * Caught error — a child throws during render and the boundary displays the
 * fallback UI. Click "Reload" to reset the boundary and re-render the child.
 */
export const CaughtError: Story = {
  render: () => (
    <div className="flex w-full items-center justify-center bg-background text-foreground">
      <ErrorBoundary>
        <ThrowOnRender message="Intentional render error from story." />
      </ErrorBoundary>
    </div>
  ),
}

/**
 * Caught error with a custom fallback node — useful when consumers want to
 * render their own UI instead of the default card.
 */
export const CustomFallback: Story = {
  render: () => (
    <div className="flex w-full items-center justify-center bg-background p-4 text-foreground">
      <ErrorBoundary
        fallback={
          <div className="rounded border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            Custom fallback: this component crashed.
          </div>
        }
      >
        <ThrowOnRender message="Hidden by custom fallback." />
      </ErrorBoundary>
    </div>
  ),
}

/**
 * Toggle a child between healthy and throwing to demo the reset lifecycle.
 */
export const ToggleError: Story = {
  render: () => (
    <div className="flex w-full items-center justify-center bg-background text-foreground">
      <ErrorBoundary>
        <ToggleChild />
      </ErrorBoundary>
    </div>
  ),
}

function ThrowOnRender({ message }: { message: string }): never {
  throw new Error(message)
}

function ToggleChild() {
  const [shouldThrow, setShouldThrow] = useState(false)
  if (shouldThrow) {
    throw new Error("Toggled error from child.")
  }
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <span className="text-sm">Child is healthy.</span>
      <Button variant="outline" onClick={() => setShouldThrow(true)}>
        Throw on next render
      </Button>
    </div>
  )
}
