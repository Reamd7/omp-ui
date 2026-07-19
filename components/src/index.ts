// @omp-web/components — shared React component library entry point.
// Visual language and interaction patterns ported from OpenChamber.
//
// Export individual components as named exports (tree-shakable).
// Keep this file side-effect free (see `sideEffects: false` in package.json).

export * from './ui'
export { cn } from './lib/utils'
