# @omp-web/components

Shared React component library for **omp-web** — visual language and interaction patterns ported from [OpenChamber](https://github.com/openchamber/openchamber).

Developed in isolation with **Storybook v10 + Rsbuild** (React). Styling: **Tailwind v4 + shadcn/ui style** — see [`docs/styling.md`](../docs/styling.md).

## Stack

|                          |                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Framework                | React 19                                                                                    |
| Build engine (Storybook) | [Rsbuild](https://rsbuild.rs) via [`storybook-react-rsbuild`](https://storybook.rsbuild.rs) |
| Styling                  | Tailwind v4 + `cva` + `cn()` — see [`docs/styling.md`](../docs/styling.md)                  |
| Headless primitives      | [`@base-ui/react`](https://base-ui.com) (Dialog / Menu / Select / Tooltip / Switch / ...)   |
| Icons                    | [`lucide-react`](https://lucide.dev)                                                        |
| Toasts                   | [`sonner`](https://sonner.emilkowal.ski)                                                    |
| Language                 | TypeScript (`strict`, `react-jsx`)                                                          |
| Toolchain pin            | `node 26.5.0` + `pnpm 11.15.0` (see root `.mise.toml`)                                      |

## Scripts

```bash
pnpm storybook        # dev server on http://localhost:6006
pnpm build-storybook  # static production build → storybook-static/
pnpm typecheck        # tsc --noEmit
```

## Layout

```
components/
├── .storybook/
│   ├── main.ts             # framework + rsbuildFinal (@ alias, rsbuild config)
│   └── preview.tsx         # global CSS import + light/dark Theme toolbar
├── postcss.config.mjs      # @tailwindcss/postcss
├── tsconfig.json           # paths: @/* → ./src/*
└── src/
    ├── index.css           # @import tailwindcss + tw-animate-css + design-system
    ├── index.ts            # package entry — re-exports ./ui + cn
    ├── styles/
    │   └── design-system.css   # light/dark semantic tokens (oklch) + @theme inline bridge
    ├── lib/
    │   └── utils.ts        # cn() = twMerge(clsx())
    └── ui/                 # atomic primitive layer (shadcn-style)
        ├── index.ts            # barrel
        ├── button.tsx + button.stories.tsx
        ├── card.tsx + card.stories.tsx
        ├── dialog.tsx + dialog.stories.tsx
        ├── dropdown-menu.tsx + .styles.ts + dropdown-trigger.ts + stories
        ├── context-menu.tsx + stories
        ├── select.tsx + stories
        ├── tooltip.tsx + stories
        ├── checkbox / radio / switch / collapsible (+ stories each)
        ├── input / textarea / number-input (+ stories each)
        ├── command / sonner / toast / ErrorBoundary (+ stories each)
        ├── skeleton + stories
        ├── text + stories                      # text effect variants
        ├── slot.tsx                            # asChild primitive
        └── ScrollShadow / OverlayScrollbar / ScrollableOverlay   # scroll utilities
```

## Atomic layer (`src/ui/`)

Strict boundary: **only shadcn-style primitives and generic utilities live here.** Business dialogs / feature surfaces belong in sibling packages (e.g. future `apps/<surface>/` or `packages/<feature>/`), **not** in `ui/`.

Current set (23 components, 19 stories):

| Group      | Components                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Form       | `Button`, `Input`, `Textarea`, `NumberInput`, `Checkbox`, `Radio`, `Switch` |
| Overlay    | `Dialog`, `DropdownMenu`, `ContextMenu`, `Select`, `Tooltip`, `Command`     |
| Disclosure | `Collapsible`                                                               |
| Feedback   | `Skeleton`, `Text`, `Sonner` (toaster), `toast` (helper), `ErrorBoundary`   |
| Utilities  | `Slot`, `ScrollShadow`, `OverlayScrollbar`, `ScrollableOverlay`, `Card`     |

## Conventions

- **Source-first exports.** `exports` maps directly to `src/index.ts`; no build step required to consume from sibling workspace packages. A `dist/` build pipeline will be added before publishing.
- **`sideEffects: false`** is set — don't write top-level side effects in `src/`.
- **One `*.stories.tsx` per component**, colocated in `src/ui/`. Use CSF 3 with typed `Meta<typeof Component>` and `StoryObj<typeof Component>`. Import types from `@storybook/react`.
- **All styling via Tailwind utilities + semantic tokens** (`bg-background`, `text-primary`, `border-border`, ...). Never inline color literals. See [`docs/styling.md`](../docs/styling.md).
- **`forwardRef` everywhere** for interactive components; let consumers override classes via `className` (composed through `cn()`).
- **i18n is intentionally absent** from the atomic layer — hardcode English strings. App-level i18n wraps these primitives.
- **Icons**: import individually from `lucide-react` (e.g. `import { Check, X } from 'lucide-react'`).

## Adding a primitive

1. Create `src/ui/<Name>.tsx` — `forwardRef`, typed props, `cva` for variants if needed, `cn()` for class composition.
2. Create `src/ui/<Name>.stories.tsx` — every variant + an `AllVariants` aggregator + disabled/error states.
3. Append `export * from './<Name>'` to `src/ui/index.ts` (don't rewrite the file — multiple batches share it).
4. `pnpm typecheck && pnpm storybook` to iterate.
