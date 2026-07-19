# @omp-web/components

Shared React component library for **omp-web** — visual language and interaction patterns ported from [OpenChamber](https://github.com/openchamber/openchamber).

Developed in isolation with **Storybook v10 + Rsbuild** (React).

## Stack

| | |
|---|---|
| Framework | React 19 |
| Build engine (Storybook) | [Rsbuild](https://rsbuild.rs) via [`storybook-react-rsbuild`](https://storybook.rsbuild.rs) |
| Language | TypeScript (`strict`, `react-jsx`) |
| Toolchain pin | `node 26.5.0` + `pnpm 11.15.0` (see root `.mise.toml`) |

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
│   ├── main.ts       # framework = storybook-react-rsbuild, stories glob
│   └── preview.ts    # global parameters / decorators
├── src/
│   ├── Button.tsx          # example component
│   ├── Button.stories.tsx  # example story (CSF)
│   └── index.ts            # public entry — named exports only, side-effect free
└── tsconfig.json
```

## Conventions

- **Source-first exports.** `exports` maps directly to `src/index.ts`; no build step required to consume from sibling workspace packages. A `dist/` build pipeline will be added before publishing.
- **`sideEffects: false`** is set — don't write top-level side effects in `src/`.
- **Storybook v10 essentials are framework-built-in** — no `addons:` field needed in `.storybook/main.ts`.
- **One `*.stories.tsx` per component**, colocated in `src/`. Use CSF 3 with typed `Meta<Props>` and `StoryObj<Props>`.
- **Inline styles only for now** — placeholder until a styling system (Tailwind / CSS-in-JS / CSS Modules) is chosen.

## Adding a component

1. Create `src/Foo.tsx` (forwardRef, typed props, named export).
2. Create `src/Foo.stories.tsx` with at least one `StoryObj`.
3. Re-export from `src/index.ts`.
4. `pnpm storybook` to iterate.
