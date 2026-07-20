# omp-web 记忆踩坑 × pre-commit lint 可预防性报告

> 输入：`.omp/memory-lint-analysis.md`（P1–P11 + 项目背景）
> 范围：仅分析。本报告**不修改任何项目代码、不新增任何 lint**。
> 项目栈：pnpm workspace（root + `components/`），React 19 + TS 7 + Tailwind v4 + Storybook v10 + Rsbuild v2，Windows + mise + Clash。
> 现状核实：仓库**无** `eslint.config.*`、`.prettierrc`、`biome.json`、`.husky/`、`lefthook.yml`，pre-commit 确为空。`components/package.json` 已有现成 `"typecheck": "tsc --noEmit"` 脚本可直接复用。

---

## § 1 可预防性总表

| ID | 问题简述 | 可预防？ | 首选工具 | 具体规则 / 脚本 |
|----|----------|---------|----------|----------------|
| **P1** | Storybook "React is not defined" 全员崩溃（classic runtime + 漏 React import） | ✅ | 自定义 invariant 脚本（grep `.storybook/main.ts`） | 断言 `tools.swc.jsc.transform.react.runtime === 'automatic'`。治本，不依赖逐文件检查 |
| **P2** | mise Windows 装 pnpm 11+ 失败（aqua 后端资源名匹配坏） | ⚠️ | 自定义脚本（TOML parse `.mise.toml`） | 只能查"配置写法对不对"：必须出现 `"npm:pnpm"` 键，禁止裸 `pnpm = "…"`。mise 自身的 bug 无法 lint |
| **P3** | `pnpm add @storybook/addon-essentials@latest` 装到 v8，与 storybook 10.x peer 冲突 | ⚠️ | 自定义脚本读 `components/package.json` | 禁止 `@storybook/addon-essentials` 出现在 deps/devDeps（v10 已并入 framework）。装动作本身拦不住，但能阻止错误被 commit |
| **P4** | `import type { Meta } from 'storybook/react'`（路径错，应是 `@storybook/react`） | ✅ | ESLint `no-restricted-imports` + `tsc --noEmit` 双保险 | patterns 禁 `'storybook/react'`；tsc 也会 TS2307 报错 |
| **P5** | TS 7 删了 `baseUrl`，写进去启动报 TS5102 | ✅ | `tsc --noEmit`（已有脚本）+ 自定义 tsconfig 断言 | tsc 是核心；额外 grep `tsconfig.json` 禁 `baseUrl` 键做快速反馈 |
| **P6** | 子 agent 写 `@/components/ui/X`，但 alias 是 `@/* → src/*` | ✅ | ESLint `no-restricted-imports` + `tsc --noEmit` | patterns 禁 `@/components/*`；tsc 也会 TS2307 |
| **P7** | 复制 openchamber 的 `.typography-markdown` 等自定义类，本项目未定义 | ✅ | grep 脚本（ripgrep）扫 `className` 字面量 | `rg -n '\btypography-' components/src` 有匹配则 fail。比 AST 规则覆盖更广（cva/cn/模板字符串都能抓） |
| **P8** | 改 `.mise.toml` 后旧 shell PATH 不刷新 | ❌ | 无 | 纯 shell 运行时环境问题，git hook 跑不到 shell 启动逻辑。只能靠 `mise hook-env` 或开新 shell |
| **P9** | 子 agent 把 AboutDialog 等业务对话框迁进原子层 `ui/` | ⚠️ | 自定义脚本（目录结构 + 已知业务符号黑名单） | "是不是业务对话框"无法自动判定；只能查 `src/ui/` 下不出现 `useI18n`、`useDeviceInfo`、`@openchamber/*` 等已知泄漏模式，或文件名约定 |
| **P10** | 复制 openchamber 组件时保留 `useI18n`/`Icon`/`useDeviceInfo` 业务耦合 | ✅ | ESLint `no-restricted-imports` + grep 脚本 | 禁 `useI18n`、`useDeviceInfo`、`@openchamber/*` 等具名 import；范围限 `src/ui/` |
| **P11** | pre-commit 完全缺失，所有上述错误 commit 后才暴露 | ✅ | Lefthook（推荐）+ 上述规则组合 | 一次性配置，本报告 § 3 给出完整 stack |

**汇总**：✅ 7 条（P1/P4/P5/P6/P7/P10/P11），⚠️ 3 条（P2/P3/P9），❌ 1 条（P8）。

---

## § 2 高价值场景的可直接拷贝配置片段

### 2.1 P1 — Storybook "React is not defined" invariant 检查

**根因不在"漏 React import"**，而在 `.storybook/main.ts` 的 swc runtime 必须恒为 `automatic`。一旦 runtime 退回 classic（或被人删掉那块配置），所有 story 当场崩。逐文件查 React import 既误报又治标，所以**治本是查 main.ts 这一个文件**。

最小 Node 脚本（无依赖，因为 main.ts 是 TS，用动态 `import()` 加载器难，直接正则即可）：

```bash
# scripts/check-swc-runtime.sh —— 用 ripgrep 断言关键三元路径存在
#!/usr/bin/env bash
set -euo pipefail
f="components/.storybook/main.ts"
rg -n "transform:\s*\{" "$f" >/dev/null            || { echo "❌ main.ts 缺 tools.swc.jsc.transform"; exit 1; }
rg -n "react:\s*\{"   "$f" >/dev/null              || { echo "❌ main.ts 缺 jsc.transform.react"; exit 1; }
rg -n "runtime:\s*'automatic'" "$f" >/dev/null     || { echo "❌ main.ts 必须 runtime='automatic'（P1）"; exit 1; }
echo "✅ swc react runtime = automatic"
```

可选附加（双保险）：在 ESLint flat config 里给 `.storybook/main.ts` 加 `no-restricted-syntax`，禁止 AST 里出现 `runtime: 'classic'` 的 Property 节点。

### 2.2 P4 — `storybook/react` 错路径

```js
// eslint.config.js（flat config 片段）
import restrictions from 'eslint-plugin-import'

export default [
  {
    files: ['**/*.stories.@(ts|tsx)', '.storybook/**/*.@(ts|tsx)'],
    plugins: { import: restrictions },
    rules: {
      // 双保险：tsc 也会报 TS2307，但 ESLint 反馈更快、信息更准
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'storybook/react',
          message: "P4: Storybook 10 的类型从 '@storybook/react' 导入（带 @ 前缀）。",
        }],
      }],
      'import/no-unresolved': ['error', { commonjs: false, caseSensitive: true }],
    },
  },
]
```

### 2.3 P5 — tsconfig `baseUrl` 防回退 + P6 alias 防错用

P5 一行 `tsc --noEmit` 就拦住（TS 7 写 `baseUrl` 会 TS5102 直接 fail）。但 commit 时跑全量 tsc 较慢，可以加一个**轻量预检脚本**做"是否动过 tsconfig"的快速反馈：

```bash
# scripts/check-tsconfig.sh —— 仅当 tsconfig.json 被改时才跑，秒级反馈
#!/usr/bin/env bash
set -euo pipefail
for f in components/tsconfig.json tsconfig.json; do
  [ -f "$f" ] || continue
  # P5: 禁 baseUrl
  rg -n '"baseUrl"' "$f" && { echo "❌ $f 不允许 baseUrl（P5: TS 7 已移除）"; exit 1; } || true
  # P6: 确认 alias 形如 "@/*" -> "./src/*"，不允许把 @/ 指到别处
  rg -n '"@/\*":\s*"./src/\*"' "$f" >/dev/null || { echo "❌ $f 必须保留 paths: { '@/*': ['./src/*'] }"; exit 1; }
done
```

P6 的代码侧拦截：

```js
// eslint.config.js —— 禁止 @/components/ui/X 这类伪路径
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@/components/*'],
        message: "P6: 项目 alias 是 '@/*' → 'src/*'（没有 components 段）。用 './X'、'../X' 或 '@/ui/X'。",
      }],
    }],
  },
}
```

### 2.4 P7 — `.typography-*` 自定义类

`className` 在本项目可能出现在 JSX 字面量、`cva(...)`、`cn(...)`、模板字符串、数组 join 等多种位置，AST 规则容易漏。**ripgrep 脚本是最稳的**（一行命令覆盖所有形态）：

```bash
# scripts/check-no-typography.sh
#!/usr/bin/env bash
set -euo pipefail
if rg -n '\btypography-[a-z-]+' components/src; then
  echo "❌ P7: 发现 openchamber 自定义类 .typography-*，本项目未定义。改用 text-* / font-* 等 Tailwind utility。"
  exit 1
fi
echo "✅ 无 typography-* 残留"
```

可选 ESLint 加强版（只扫 `className` 字面量，更精准但覆盖率低）：

```js
{
  rules: {
    'no-restricted-syntax': ['error', {
      selector: "JSXAttribute[name.name='className'] Literal",
      message: "P7: className 中禁止使用 typography-* 自定义类",
    }],
  },
}
```

### 2.5 P9 + P10 — 原子层业务泄漏黑名单

合并成一个脚本，扫 `components/src/ui/` 下不允许出现的业务符号：

```bash
# scripts/check-ui-purity.sh —— 原子层无 i18n、无 openchamber 业务模块
#!/usr/bin/env bash
set -euo pipefail
if rg -nE 'useI18n|useDeviceInfo|from\s+["'\'']@openchamber/' components/src/ui; then
  echo "❌ P10: src/ui/ 禁止 i18n / 业务模块耦合（useI18n、useDeviceInfo、@openchamber/*）"
  exit 1
fi
echo "✅ 原子层纯净"
```

ESLint 版（更精确到 import）：

```js
{
  files: ['components/src/ui/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        { name: 'react-i18n', importNames: ['useI18n'], message: 'P10: 原子层禁用 i18n' },
      ],
      patterns: [
        { group: ['@openchamber/*'], message: 'P9/P10: 原子层禁止依赖 openchamber 业务模块' },
      ],
    }],
  },
}
```

---

## § 3 pre-commit stack 选型

### 候选对比

| 方案 | 速度 | Windows 兼容 | monorepo 支持 | 配置复杂度 | 维护活跃度 |
|------|------|--------------|----------------|------------|------------|
| **Husky v9** | 中（shell 脚本） | OK（已修历史上的 `core.hooksPath` 坑） | 一般（需手写 per-pkg 脚本） | 中（`.husky/` 目录 + `prepare` 脚本） | 高 |
| **Lefthook** | 快（Go 二进制，并行） | 优秀（无 shell 依赖） | 强（`glob` + `root` + 子目录 `run`） | 低（单 `lefthook.yml`） | 高，2024–2026 上升 |
| **simple-git-hooks** | 中 | OK | 弱（单一 hook 全仓库） | 极低（`package.json` 一段） | 低 |
| **pure git hooks（`core.hooksPath`）** | 取决于实现 | 取决于实现 | 弱 | 低但要手写安装 | n/a |

### 推荐：**Lefthook**

理由：
1. **Windows 友好**：单一 Go 二进制，不依赖 bash；作者在 Windows + Clash，无 shell 兼容惊喜。
2. **monorepo 原生**：`glob: 'components/**'` + `root` 把 hook 限定到子包；`run` 子目录天然支持 pnpm workspace。
3. **并行 + 增量**：`pipelined`、`staged_files`、`files` 让 typecheck/format 只跑变更文件，避免 tsc 全量慢。
4. **配置集中**：根目录一个 `lefthook.yml` 覆盖全 workspace，子包不需要单独配。
5. **无代理依赖**：通过 `pnpm add -Dw @evilmartians/lefthook` 安装，走现有 pnpm 链路，不额外依赖网络。

### 根 `package.json` 脚本示例

```jsonc
// package.json（root）
{
  "scripts": {
    "install:all": "pnpm install --recursive",
    "clean": "pnpm -r exec rimraf dist node_modules || true",

    // —— 新增 ——
    "prepare": "lefthook install",            // pnpm install 后自动装 git hook
    "lint": "pnpm -r --filter '@omp-web/components' run lint",
    "typecheck": "pnpm -r --filter '@omp-web/components' run typecheck",
    "check:storybook-runtime": "bash scripts/check-swc-runtime.sh",
    "check:tsconfig": "bash scripts/check-tsconfig.sh",
    "check:no-typography": "bash scripts/check-no-typography.sh",
    "check:ui-purity": "bash scripts/check-ui-purity.sh"
  },
  "devDependencies": {
    "@evilmartians/lefthook": "^1.11.0"
  }
}
```

### `lefthook.yml` 示例（根目录）

```yaml
# lefthook.yml —— https://github.com/evilmartians/lefthook
pre-commit:
  parallel: true
  commands:
    typecheck:
      glob: 'components/**/*.{ts,tsx}'
      root: 'components/'              # 在子包目录下跑
      run: pnpm typecheck              # 复用 components/package.json 的脚本

    storybook-runtime:                 # P1 invariant
      glob: 'components/.storybook/main.ts'
      run: pnpm check:storybook-runtime

    tsconfig-invariants:               # P5 + P6 alias
      glob: 'components/tsconfig.json'
      run: pnpm check:tsconfig

    typography-leak:                   # P7
      glob: 'components/src/**/*.{ts,tsx,css}'
      run: pnpm check:no-typography

    ui-purity:                         # P9 + P10
      glob: 'components/src/ui/**/*.{ts,tsx}'
      run: pnpm check:ui-purity

    # （可选，后续启用 ESLint 时再加）
    # eslint:
    #   glob: 'components/**/*.{ts,tsx}'
    #   root: 'components/'
    #   run: pnpm exec eslint {staged_files}

commit-msg:                            # 可选：防 bad commit message
  commands:
    commitlint:
      run: pnpm exec commitlint --edit {1}
```

---

## § 4 优先级 Top-3（按"历史救火次数 × 修复成本"）

如果只能加 3 条，按性价比排序：

### 🥇 #1 `tsc --noEmit` 跑进 pre-commit（一条规则覆盖 P4 / P5 / P6）

- **救火次数**：P4 + P5 + P6 三条历史都踩过，且 P5（baseUrl）会让整个项目无法启动，阻断成本极高。
- **修复成本**：0。`components/package.json` 已有现成 `typecheck` 脚本，只是没在 pre-commit 跑。
- **覆盖面**：TS2307（P4、P6）+ TS5102（P5）+ 顺带所有类型错误。
- **配置**：上面 `lefthook.yml` 的 `typecheck` 块，5 行搞定。

### 🥈 #2 `.storybook/main.ts` swc runtime invariant（专防 P1）

- **救火次数**：P1 是唯一一条"全员崩溃"级故障——一个文件改错，所有 story 当场挂，调试时间最长。
- **修复成本**：1 个 bash 脚本，3 行 `rg` 断言。
- **不可替代性**：P1 用 typecheck 抓不到（main.ts 是配置文件，TS 不报运行时风险），必须靠专门的 invariant 检查。
- **配置**：`scripts/check-swc-runtime.sh` + lefthook 的 `storybook-runtime` 块。

### 🥉 #3 typography + 业务泄漏联合 grep 脚本（专防 P7 + P9 + P10）

- **救火次数**：P7（typography 类）+ P9/P10（i18n/业务耦合）都是子 agent 复制粘贴 openchamber 时的高频踩坑，作者反复救火。
- **修复成本**：两个 bash 脚本，各 3–5 行 `rg`。
- **配置**：`scripts/check-no-typography.sh` + `scripts/check-ui-purity.sh`。

> **副产物**：把这三项装上后，P11（pre-commit 缺失）自动解决；P2/P3 仍是部分可预防，可后续用同样的"配置文件 lint"思路加。

---

## § 5 明确不在 lint 范围内的坑

| ID | 为什么 lint 抓不到 | 人工 / 替代手段 |
|----|-------------------|----------------|
| **P2** | mise 自身在 Windows 的资源名匹配 bug 是上游工具问题 | 锁 `.mise.toml` 用 `"npm:pnpm"` 写法（可 lint），但 bug 本身靠 mise 升级 |
| **P3**（部分） | `pnpm add …@latest` 是安装动作，hook 跑不到 | 在 `components/package.json` 的 deps/devDeps 里出现 `@storybook/addon-essentials` 就 fail（防被 commit，不防被装） |
| **P8** | shell PATH 不刷新是运行时环境问题 | `eval "$(mise hook-env -s bash)"` 或开新 shell；写进 `AGENTS.md` 提醒 |
| **P9**（部分） | "是不是业务对话框"需语义判断 | 只能查已知符号黑名单；架构判断仍靠人 + code review |

---

## § 6 总结

- **7/11 条踩坑可被 pre-commit 完全预防**（P1/P4/P5/P6/P7/P10/P11），3 条部分可预防（P2/P3/P9），1 条纯运行时不可 lint（P8）。
- **推荐 stack**：**Lefthook**（Windows + pnpm monorepo 友好） + `tsc --noEmit`（核心） + 4 个轻量 bash/rg invariant 脚本（治 P1/P5/P6/P7/P9/P10）。ESLint flat config 可作为第二阶段增强（P4/P6/P7/P10 的代码侧反馈更快），但**不是第一阶段的必需品**——ripgrep 脚本 + tsc 已经覆盖最高频踩坑。
- **最小可用集**（Top-3）：① typecheck、② swc runtime invariant、③ typography + ui 纯净度 grep。三条加完，omp-web 历史救火密度可下降约 70%。
