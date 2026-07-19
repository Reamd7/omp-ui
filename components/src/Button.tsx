import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

/**
 * buttonVariants —— Button 的 class 变体表
 *
 * 设计原则（与 openchamber 对齐）：
 * - 不写 inline style，全部用语义 utility 类（bg-primary / text-foreground / ...）
 * - 默认扁平化（无 elevation），用 ring + 边框 + 背景对比承担可点击性
 * - hover / active / focus-visible / disabled 状态显式声明
 * - 通过 cva 把 variant × size 组合的类聚合在一起
 */
export const buttonVariants = cva(
  // base：所有变体共享
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md text-sm font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'active:bg-primary/80',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
          'active:bg-secondary/70',
        ].join(' '),
        outline: [
          'border border-border bg-background text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'active:bg-accent/80',
        ].join(' '),
        ghost: [
          'text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'active:bg-accent/80',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          'active:bg-destructive/80',
        ].join(' '),
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Button — @omp-web/components 的基础按钮。
 *
 * @example
 *   <Button variant="primary" size="md">Save</Button>
 *   <Button variant="outline" onClick={...}>Cancel</Button>
 *   <Button variant="destructive" disabled>Delete</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  )
})
