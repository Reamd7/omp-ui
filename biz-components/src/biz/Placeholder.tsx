import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Placeholder — 业务组件占位
 *
 * 这是 biz-components 包当前唯一的"组件"，存在的目的是让脚手架跑通：
 *   - 验证 workspace + alias 链路（@omp-web/components / @components/*）
 *   - 验证 Tailwind v4 @source 跨包扫描生效
 *   - 验证 Storybook 自动 JSX runtime + Rsbuild alias
 *
 * 后续真实业务组件（chat / session / settings 页等）会按
 * docs/openchamber-business-components.md 的迁移路线逐步加进本目录，
 * 此 Placeholder 可在那时删除或保留作为示例。
 */

const placeholderVariants = cva(
  "inline-flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "min-h-16 p-3 text-xs",
        md: "min-h-32 p-6 text-sm",
        lg: "min-h-48 p-8 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof placeholderVariants> {
  /**
   * 占位提示文案。默认 "Placeholder"。
   * 业务组件没填好时给一个明确的"这里待实现"信号。
   */
  label?: string;
}

export const Placeholder = React.forwardRef<HTMLDivElement, PlaceholderProps>(
  ({ className, size, label = "Placeholder", children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(placeholderVariants({ size }), className)} {...props}>
        <span className="font-medium tracking-wide uppercase opacity-70">{label}</span>
        {children}
      </div>
    );
  },
);
Placeholder.displayName = "Placeholder";
