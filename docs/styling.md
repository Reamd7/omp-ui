# omp-web 样式方案

本项目（包括 `@omp-web/components` 在内的所有 UI 包）使用的统一样式方案。**新增任何 UI 代码前请先读完本文。**

## TL;DR

| 维度 | 选型 |
|---|---|
| CSS 引擎 | **Tailwind CSS v4**（`@import "tailwindcss"`，无 `tailwind.config.js`） |
| 组件范式 | **shadcn/ui 风格**（new-york style）—— 不是 npm 依赖，是约定 |
| 类名合成 | **`clsx` + `tailwind-merge` + `class-variance-authority`**，统一通过 `cn()` 工具 |
| 设计令牌 | **语义化 CSS 变量**（`oklch()` 色彩空间），在 `src/styles/design-system.css` 定义 |
| Tailwind 桥接 | **`@theme inline { --color-*: var(--*) }`** —— 让 `bg-background` / `text-primary` 等 utility 引用 CSS 变量 |
| 暗色模式 | **`.dark` 类**（通过 `@custom-variant dark` 注册），由 theme provider 切换 |
| Headless 原语 | （计划中）**`@base-ui/react`**（MUI 团队出的 Radix 替代） |
| 图标 | **`lucide-react`** |
| 动画 | **`tw-animate-css`**（animate-in / fade-in / ...）+ `motion`（复杂场景） |
| 色彩基调 | **暖色沙漠（warm sand）+ 金沙橙（golden sand）主调**，参考 openchamber |

> 选型参考：`backup/openchamber/packages/ui/src/styles/design-system.css`（只读）。

---

## 1. 文件结构

```
components/
├── postcss.config.mjs           # 注册 @tailwindcss/postcss（Rsbuild 自动加载）
├── .storybook/
│   ├── main.ts                  # framework + rsbuildFinal（@ alias 在此注入）
│   └── preview.tsx              # import 全局 CSS + 主题切换 decorator
└── src/
    ├── index.css                # 入口：@import "tailwindcss" + 设计系统 + base 层
    ├── styles/
    │   └── design-system.css    # 语义令牌（light + dark）+ @theme inline 桥接
    ├── lib/
    │   └── utils.ts             # cn() 工具
    ├── Button.tsx               # cva + cn + 语义类
    └── Button.stories.tsx       # Storybook CSF3
```

---

## 2. 核心机制：从 CSS 变量到 utility class

### 2.1 令牌声明（`design-system.css`）

```css
@layer base {
  :root {
    --background: oklch(0.97 0.02 85);   /* 暖沙漠背景 */
    --foreground: oklch(0.25 0.02 40);
    --primary:    oklch(0.65 0.2 55);    /* 橙色主色 */
    /* ...card / popover / secondary / muted / accent / destructive / border / input / ring / chart-1..5 */
  }
  .dark {
    --background: oklch(0.16 0.01 30);
    --primary:    oklch(0.77 0.17 85);   /* 金沙橙 */
    /* ... */
  }
}
```

### 2.2 桥接到 Tailwind（`@theme inline`）

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary:    var(--primary);
  /* ... */
}
```

`@theme inline` 告诉 Tailwind 在生成 utility 时**引用 CSS 变量**（而非构建期烤死值），从而支持运行时切换主题。

### 2.3 组件里直接用

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />
<div  className="bg-background text-foreground border border-border" />
```

完整对照表：

| CSS 变量 | utility 类 |
|---|---|
| `--background` | `bg-background` |
| `--foreground` | `text-foreground` |
| `--card` / `--card-foreground` | `bg-card` / `text-card-foreground` |
| `--popover` / `--popover-foreground` | `bg-popover` / `text-popover-foreground` |
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` |
| `--secondary` / `--secondary-foreground` | `bg-secondary` / `text-secondary-foreground` |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` |
| `--accent` / `--accent-foreground` | `bg-accent` / `text-accent-foreground` |
| `--destructive` / `--destructive-foreground` | `bg-destructive` / `text-destructive-foreground` |
| `--border` | `border-border` |
| `--input` | `bg-input` |
| `--ring` | `ring-ring` |
| `--radius` | `rounded-lg`（已映射） |

---

## 3. `cn()` 与 `cva()`：类名合成工作流

### 3.1 `cn()` —— 合并 + 去重

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- `clsx`：处理条件 / 对象 / 数组形式的类名
- `tailwind-merge`：解决 Tailwind 类冲突（`cn('px-2', 'px-4')` → `'px-4'`）

**永远不要**直接用 `'a' + ' ' + (cond ? 'b' : 'c')` 拼字符串 —— 一律走 `cn()`。

### 3.2 `cva()` —— 变体声明

复杂组件用 `cva` 把 `variant × size` 组合的类聚集到一处：

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  // base：所有变体共享
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:   'border border-border bg-background hover:bg-accent',
        ghost:     'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
```

### 3.3 组件形态（标准模板）

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(/* ...如上 */)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

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
```

关键约定：
- **`forwardRef`** —— 所有交互组件必须支持 ref 透传
- **`className` 始终放最后**，通过 `cn(...)` 允许调用方覆盖（依赖 `tailwind-merge` 去重）
- **导出 `<Name>Variants`** —— 让调用方复用类（如 `<Link className={cn(buttonVariants(), ...) />`）

---

## 4. 添加新组件流程

1. 在 `src/` 下创建 `<Name>.tsx`：
   - 用 `cva` 定义变体（如果有视觉变体）
   - 用 `forwardRef` + `cn` 组合类名
   - 只用语义 utility（`bg-primary` / `text-muted-foreground` / ...），**不要**写颜色字面量
2. 在 `src/` 下创建 `<Name>.stories.tsx`，至少一个 `StoryObj`；多变体加 `AllVariants` 故事
3. 在 `src/index.ts` 重新导出：组件 + `<Name>Variants` + 类型
4. `pnpm storybook` 在 http://localhost:6006 迭代
5. `pnpm typecheck && pnpm build-storybook` 验证

---

## 5. 暗色模式

通过给 `<html>` 加 `.dark` 类切换：

```ts
document.documentElement.classList.toggle('dark', isDark)
```

在 Storybook 里：preview 工具栏的 "Theme" 下拉切换（见 `.storybook/preview.tsx`）。

在 app 里：建议后续接入 [`next-themes`](https://github.com/pacocoursey/next-themes)（不依赖 Next.js 也能用，Electron / Web 都 OK）。

**写组件时不要操心主题**——只写 `bg-background text-foreground`，主题切换靠令牌自动生效。

---

## 6. 反模式（禁止）

| ❌ 反模式 | ✅ 正确做法 |
|---|---|
| `style={{ color: '#2563eb' }}` 字面量色值 | `className="text-primary"`（用语义令牌） |
| `'px-2 ' + (x ? 'foo' : 'bar')` 字符串拼接 | `cn('px-2', x && 'foo')` |
| `bg-blue-500` Tailwind 调色板直用 | `bg-primary` / `bg-destructive` 语义类 |
| 把 `dark:bg-...` 写死颜色 | 用 `dark:bg-primary` 复用同一令牌 |
| 自定义 CSS 文件散落 | 集中到 `src/styles/<name>.css` 并在 `index.css` 里 `@import` |
| 在组件文件里写 `<style>` / CSS-in-JS | 全部走 Tailwind utility + cva |

---

## 7. 关键依赖

```jsonc
// components/package.json — devDependencies 摘录
{
  "tailwindcss": "^4.3.3",              // 引擎
  "@tailwindcss/postcss": "^4.3.3",     // PostCSS 集成
  "class-variance-authority": "^0.7.1", // cva() 变体
  "clsx": "^2.1.1",                     // 类名条件合成
  "tailwind-merge": "^3.6.0",           // Tailwind 类去重
  "lucide-react": "^1.25.0",            // 图标
  "tw-animate-css": "^1.4.0"            // 动画工具类
}
```

`cva` / `clsx` / `tailwind-merge` 当前在 devDeps 是因为包是 `private + source-first`；将来发 npm 包时要迁到 `dependencies`。

---

## 8. 路径别名 `@/*`

`@/lib/utils`、`@/components/...` 这种导入通过两层配置支持：

- **TS**：`tsconfig.json` 里 `"paths": { "@/*": ["./src/*"] }`
- **Rsbuild（Storybook）**：`.storybook/main.ts` 的 `rsbuildFinal.source.alias['@'] = <abs path to src>`

新增包（`apps/*`、`packages/*`）时复用同样的别名约定。

---

## 9. 参考资源

- **openchamber 参考**：`backup/openchamber/packages/ui/src/styles/design-system.css`、`.../components/ui/button.tsx`（只读）
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs/installation/using-postcss)
- [shadcn/ui docs](https://ui.shadcn.com/)（设计哲学与组件模板，非依赖）
- [class-variance-authority](https://cva.style/)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [OKLCH 色彩空间](https://oklch.com/)（为什么用它做主题）
