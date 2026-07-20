/**
 * cn — 类名合成工具（从 @omp-web/components 复用）
 *
 * 不在本包复制一份是为了让原子层和业务层共用同一个 tailwind-merge 实例，
 * 避免 class composition 在两层之间产生不一致的合并结果。
 *
 * 业务组件用法（与 components 包一致）：
 *   cn("flex items-center", isActive && "bg-primary", className)
 */
export { cn } from "@omp-web/components";
