import * as React from 'react'
import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "./button"
import { Toaster } from "./sonner"
import { toast } from "./toast"

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta

type Story = StoryObj<typeof Toaster>

/**
 * Click any button to fire a toast. The `<Toaster />` portal is mounted once
 * and listens for `toast(...)` calls — switch the Theme toolbar to see the
 * light/dark variants.
 */
export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap items-center gap-2 bg-background text-foreground">
        <Button variant="outline" onClick={() => toast("Hello")}>
          toast()
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Saved successfully")}
        >
          success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Something failed", {
              description: "Click Copy to capture the error text.",
            })
          }
        >
          error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Heads up — this is informational")}
        >
          info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Be careful with this action")}
        >
          warning
        </Button>
      </div>
    </>
  ),
}

/**
 * Each toast type rendered with its semantic icon colour.
 */
export const AllTypes: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap items-center gap-2 bg-background text-foreground">
        <Button variant="outline" onClick={() => toast("Plain message")}>
          plain
        </Button>
        <Button variant="outline" onClick={() => toast.success("Success")}>
          success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Error", { description: "Description below the title" })
          }
        >
          error
        </Button>
        <Button variant="outline" onClick={() => toast.info("Info")}>
          info
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Warning")}>
          warning
        </Button>
      </div>
    </>
  ),
}

/**
 * Stacked toasts — fire several in quick succession.
 */
export const Stacked: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap items-center gap-2 bg-background text-foreground">
        <Button
          variant="outline"
          onClick={() => {
            toast("First")
            setTimeout(() => toast.success("Second"), 200)
            setTimeout(() => toast.info("Third"), 400)
            setTimeout(() => toast.warning("Fourth"), 600)
            setTimeout(() => toast.error("Fifth"), 800)
          }}
        >
          Fire 5 in a row
        </Button>
      </div>
    </>
  ),
}

/**
 * Auto-dismiss behaviour — fires a toast and clears it via the helper.
 */
export const AutoDismiss: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap items-center gap-2 bg-background text-foreground">
        <Button
          variant="outline"
          onClick={() => {
            const id = toast("Dismissing in 2s...")
            setTimeout(() => toast.dismiss(id), 2000)
          }}
        >
          Dismiss after 2s
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </div>
    </>
  ),
}
