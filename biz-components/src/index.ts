// @omp-web/biz-components — 业务组件层入口
//
// 基于原子原语（@omp-web/components/ui/*）组合出的业务组件 / 复合组件。
// 严格边界：本包不放 shadcn 级原子原语（仍在 components/src/ui/），
// 也不放特定 app 的页面级编排（归 apps/<feature>/）。
//
// Export individual components as named exports (tree-shakable).
// Keep this file side-effect free (see `sideEffects: false` in package.json).

export * from "./biz";
