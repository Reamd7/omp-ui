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
        ├── Placeholder.tsx     # scaffolding placeholder — delete when real biz components arrive
        └── Placeholder.stories.tsx
```

## Conventions

Inherited from [`@omp-web/components`](../components/README.md#conventions). Additionally:

- **One `*.stories.tsx` per component**, colocated in `src/biz/`.
- **Append-only barrel.** `src/biz/index.ts` is shared — append `export * from "./<Name>"`, don't rewrite.
- **No store / sync / runtime coupling.** If a component needs app state, lift it to props and let `apps/<feature>/` wire it.

## Migration roadmap

See [`docs/openchamber-business-components.md`](../docs/openchamber-business-components.md) for the full classification (🟢 pure / 🟡 light / 🔴 heavy) and phased migration plan from OpenChamber.
