export * from "./ChatErrorBoundary";
export * from "./chatSurfaceContextValue";
export * from "./ChatSurfaceContext";
export * from "./types";
export * from "./components";
// MarkdownRenderer 的完整迁移（marked + Shiki worker + KaTeX + DOMPurify）
// 因依赖链庞大（1245 LOC + 4 个 npm 包 + web worker）放在 Phase 3/4 占位区，
// 见 src/biz/_placeholders/MarkdownRenderer.tsx。
