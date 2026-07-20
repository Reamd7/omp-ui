import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Construction, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ComingSoon — 占位组件，标识 Phase 3/4 文档中列出但尚未真实迁移的业务组件。
 *
 * 用途：在 Storybook 中给每个 Phase 3/4 组件一个独立 story，明确显示
 *   - 组件名
 *   - 当前 phase（🔴 Phase 3 重耦合 / 🟣 Phase 4 按需）
 *   - 为什么没迁（依赖的 store / SDK / 3rd-party 包）
 *   - 何时可以迁（"等 app 层 store 建好" / "等 LLM provider 抽象层"）
 *
 * 不放真实业务逻辑；只是给 Storybook 一个可见的 "roadmap" 入口。
 */

const phaseVariant = cva("rounded-md border px-3 py-2 text-xs font-semibold", {
  variants: {
    phase: {
      "3": "border-destructive/30 bg-destructive/5 text-destructive",
      "4": "border-primary/30 bg-primary/5 text-primary",
      deferred: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
    },
  },
  defaultVariants: { phase: "3" },
});

const severityIcon: Record<Phase, LucideIcon> = {
  "3": Construction,
  "4": AlertCircle,
  deferred: AlertCircle,
};

type Phase = "3" | "4" | "deferred";

export interface ComingSoonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof phaseVariant> {
  /** 组件名（如 "ChatInput"） */
  name: string;
  /** 在 openchamber 的相对路径（如 "chat/ChatInput.tsx"） */
  source?: string;
  /** 为何没迁 */
  reason: React.ReactNode;
  /** 何时可以迁 */
  when?: React.ReactNode;
  /** 重耦合的依赖（store / SDK / 3rd-party 包名） */
  coupling?: string[];
  /** 行数（迁移成本提示） */
  linesOfCode?: number;
  /** 迁移策略：rewrite 优于 migrate */
  strategy?: "rewrite" | "migrate" | "skip";
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  name,
  source,
  reason,
  when,
  coupling,
  linesOfCode,
  strategy = "migrate",
  phase = "3",
  className,
  ...rest
}) => {
  const PhaseIcon = severityIcon[phase ?? "3"];
  const strategyLabel =
    strategy === "rewrite" ? "建议重写" : strategy === "skip" ? "不迁" : "可迁移";

  return (
    <div
      className={cn(
        "flex min-h-48 w-full max-w-md flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-5",
        className,
      )}
      {...rest}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <PhaseIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
          <h3 className="truncate text-base font-semibold text-foreground">{name}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className={cn(phaseVariant({ phase }))}>Phase {phase}</span>
        </div>
      </div>

      {source && (
        <code className="block truncate rounded bg-background/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
          openchamber/{source}
        </code>
      )}

      <div className="space-y-1 text-sm">
        <p className="text-foreground/80">
          <span className="font-medium">为何未迁：</span>
          {reason}
        </p>
        {when && (
          <p className="text-muted-foreground">
            <span className="font-medium">何时可迁：</span>
            {when}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {linesOfCode !== null && linesOfCode !== undefined && (
          <span className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-muted-foreground">
            ~{linesOfCode} LOC
          </span>
        )}
        <span className="rounded bg-background/60 px-1.5 py-0.5 text-muted-foreground">
          {strategyLabel}
        </span>
        {coupling?.map((dep) => (
          <span
            key={dep}
            className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-muted-foreground"
          >
            {dep}
          </span>
        ))}
      </div>
    </div>
  );
};
