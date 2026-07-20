# @omp-web/biz-components

Business / composite React components for **omp-web** — built on top of [`@omp-web/components`](../components/).

## Scope

| Layer                           | Package                   | Holds                                           |
| ------------------------------- | ------------------------- | ----------------------------------------------- |
| **Atomic**                      | `@omp-web/components`     | shadcn-style primitives (Button / Dialog / ...) |
| **Business** ← **this package** | `@omp-web/biz-components` | Composed, feature-leaning UI built from atomics |
| App                             | future `apps/<feature>/`  | Page-level composition wired to stores/routing  |

Strict boundary: this package imports primitives from `@omp-web/components` and **only** adds composition. No shadcn-level primitive belongs here; no app-level store/routing coupling belongs here either.

## Stack

Identical to `@omp-web/components` (Storybook 10 + Rsbuild + Tailwind v4 + TS 7 + React 19). See [`../components/README.md`](../components/README.md) for the full stack table.

## How it consumes `@omp-web/components`

Two parallel mechanisms — both must stay in sync:

1. **Workspace dep** (`package.json`)

   ```json
   "dependencies": { "@omp-web/components": "workspace:*" }
   ```

   Lets you `import { Button, cn } from "@omp-web/components"`.

2. **Path alias** (`tsconfig.json` + `.storybook/main.ts`)

   ```
   @components/* → ../components/src/*
   ```

   Lets you import **source** directly without going through the package barrel — useful for deep imports like `@components/ui/button` while still benefiting from type-checking and Tailwind scanning.

3. **CSS / design tokens** are **not** duplicated. `.storybook/preview.tsx` imports `@omp-web/components/styles.css`, which carries the full Tailwind setup + semantic OKLCH tokens + base layer. This package's `src/index.css` only adds `@source` directives so Tailwind scans both packages.

## Scripts

```bash
pnpm storybook        # dev server on http://localhost:6007  (note: 6007, not 6006)
pnpm build-storybook  # static production build → storybook-static/
pnpm typecheck        # tsc --noEmit
```

## Layout

```
biz-components/
├── .storybook/
│   ├── main.ts             # framework + rsbuildFinal (@ + @components aliases, swc automatic runtime)
│   └── preview.tsx         # imports @omp-web/components/styles.css + Theme toolbar
├── postcss.config.mjs      # @tailwindcss/postcss (same as components)
├── tsconfig.json           # paths: @/* → ./src/*, @components/* → ../components/src/*
└── src/
    ├── index.css           # @source directives (scan self + sibling components)
    ├── index.ts            # package entry — re-exports ./biz
    ├── lib/
    │   └── utils.ts        # re-export cn from @omp-web/components (single source of truth)
    └── biz/                # business component layer
        ├── index.ts            # barrel
        ├── Placeholder.tsx     # scaffolding placeholder (kept as API example)
        ├── icons/              # Phase 1: 5 OpenChamber SVG icons (lucide supplements)
        ├── chat/               # Phase 1: ChatErrorBoundary + ChatSurfaceContext + chat/components/
        │   ├── message/        #   MessageHeader (Phase 2)
        │   └── components/     #   ScrollToBottomButton / TurnItem / TurnAssistantBlock /
        │                       #   TurnActivity / PromptNavigatorRail (707 LOC full migration)
        ├── settings/           # Phase 1: sections/shared full set (7 files)
        ├── layout/             # Phase 2: ResizableSidebar (merges Sidebar + RightSidebar)
        ├── session/            # Phase 2: ThinkingPill + ArchiveAllDropdown
        └── _placeholders/      # Phase 3/4: ComingSoon + 30+ placeholder stories
```

## Conventions

Inherited from [`@omp-web/components`](../components/README.md#conventions). Additionally:

- **One `*.stories.tsx` per component**, colocated in `src/biz/`.
- **Story boundary = component boundary.** A story shows the component under test plus the children it directly composes (e.g. `SettingsSidebarLayout` story shows `SettingsSidebarLayout` + the `SettingsSidebarItem`s rendered inside it). It does **not** bring in unrelated sibling components to make the screenshot look like a complete page. If a real openchamber page is composed of multiple independent biz components (e.g. `SettingsView` nav + `SettingsSidebarLayout` + detail panel), the full-page replica belongs in a separate `_demos/` directory (or `apps/<feature>/` at app layer) — not stuffed into a single component's story.
- **Append-only barrel.** `src/biz/index.ts` is shared — append `export * from "./<Name>"`, don't rewrite.
- **No store / sync / runtime coupling.** If a component needs app state, lift it to props and let `apps/<feature>/` wire it.
- **`_`-prefixed subdirs** (e.g. `_placeholders/`, future `_demos/`) are skipped by `scripts/check-ui-purity.mjs` — these hold roadmap / scaffold / page-level demo content, not real components.

## Migration roadmap + status

Phased plan from [`docs/openchamber-business-components.md`](../docs/openchamber-business-components.md). Current status:

| Phase                     | Status                            | Components                                                                                                                                                                                                                                                                                 |
| ------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Phase 1** (pure)        | ✅ Done (commit `c812b26`)        | icons (5) + ChatErrorBoundary + ChatSurfaceContext + chat/components (5: ScrollToBottomButton / TurnItem / TurnAssistantBlock / TurnActivity / PromptNavigatorRail) + chat/types + sections/shared (7 files)                                                                               |
| **Phase 2** (light)       | ✅ Partial (commit `343b66d`)     | ResizableSidebar + MessageHeader + ThinkingPill + ArchiveAllDropdown                                                                                                                                                                                                                       |
| **Phase 2 reclassified**  | ⏭ Deferred to Phase 3 placeholder | PermissionCard (461 LOC, 5 sync deps) / QuestionCard (570 LOC, 6 sync deps) / ToolOutputDialog / ReviewFlowDialog / SessionSwitcherDropdown / GitHubIntegrationDialog / SessionDialogs / comments/ / onboarding/ / code/WorkerHighlightedCode. Doc misjudged coupling — all turn out heavy |
| **Phase 3** (heavy)       | ⏭ Placeholders only               | chat/{ChatContainer,ChatInput,ChatMessage,MessageList,...} + session/{SessionSidebar,...} + layout/{MainLayout,Header,...} + views/ (8) + multirun/ + sections/*Page (80)                                                                                                                  |
| **Phase 4** (on-demand)   | ⏭ Placeholders only               | terminal / auth / update / desktop / model-picker / mini-chat / mcp / dictation                                                                                                                                                                                                            |
| **Deferred from Phase 1** | ⏭ Placeholder                     | MarkdownRenderer (1245 LOC + marked + Shiki worker + KaTeX + DOMPurify)                                                                                                                                                                                                                    |

Each Phase 3/4 component has its own Storybook story under `Biz/_placeholders/` showing name / source path / reason / coupling / LOC / strategy (migrate / rewrite / skip).

**ComingSoon component** is the visual placeholder — pass `name`, `phase`, `reason`, `when`, `coupling`, `linesOfCode`, `strategy` props.

## Decoupling patterns (consistent across all migrated components)

- **i18n hook** → hardcoded English defaults + optional `labels` / `texts` / `*Label` prop for app-layer i18n override
- **`<Icon name="X" />`** → individual `lucide-react` imports (e.g. `<User />`, `<Bot />`, `<Sparkles />`, `<ChevronDown />`)
- **openchamber typography classes** (typography.meta / typography.ui-label / typography.settings-*) → standard Tailwind utilities (text-xs / text-sm / font-medium / etc.)
- **store deps** (UI store / projects store / session-UI store) → controlled props
- **`@/lib/desktop` `isVSCodeRuntime`** → removed (assume desktop runtime)
- **`@opencode-ai/sdk` `Part[]`** → caller pre-renders to `string` / `Map<string, string>`
- **`var(--surface-X)` tokens** → standard tokens (`--background` / `--muted` / `--foreground` / `--card`)
- **`X != null`** → explicit `X !== null && X !== undefined` (oxlint eqeqeq enforcement)
