// @omp-web/components/src/ui — atomic primitive barrel
// Re-exports every shadcn-style primitive. Each migration batch appends here.

// Foundation (Wave 1)
export * from './slot'
export * from './card'
export * from './skeleton'
export * from './text'
export * from './ScrollShadow'
export * from './OverlayScrollbar'
export * from './ScrollableOverlay'

// Batch C — Tooltip / Checkbox / Radio / Switch / Collapsible
export * from './tooltip'
export * from './checkbox'
export * from './radio'
export * from './switch'
export * from './collapsible'
// Batch A — form input primitives
export * from './button'
export * from './input'
export * from './textarea'
export * from './number-input'

// Batch B — Overlay / Menu primitives
export * from './dialog'
export * from './dropdown-menu.styles'
export * from './dropdown-menu'
export * from './dropdown-trigger'
export * from './context-menu'
export * from './select'

// Batch D — Command / Sonner / Toast / ErrorBoundary
export * from './command'
export * from './sonner'
export * from './toast'
export * from './ErrorBoundary'
