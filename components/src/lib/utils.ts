/**
 * cn — 类名合成工具（shadcn/ui 标准）
 *
 * - clsx: 处理条件类名（cn('a', cond && 'b', { c: true })）
 * - tailwind-merge: 解决 Tailwind 类名冲突（cn('px-2', 'px-4') → 'px-4'）
 *
 * 用法：
 *   cn('flex items-center', isActive && 'bg-primary', className)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
