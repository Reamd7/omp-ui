# OpenChamber 业务组件分析报告

> 基于 openchamber `packages/ui/src/components/` 全量扫描（20 个 feature 子目录，478 个文件）
> 目的：为 omp-web 后续业务组件迁移做分类、优先级评估、依赖识别

## 顶层组合（App.tsx → MainLayout）

```
App.tsx
└─ MainLayout  (🔴 583 LOC, 8 store 字段)
   ├─ Sidebar                 ← SessionSidebar (session/)
   ├─ Header                  ← 2675 LOC tabstrip + 窗口控件
   ├─ BottomTerminalDock      ← terminal/TerminalViewport
   ├─ RightSidebar            ← RightSidebarTabs
   ├─ ContextPanel            ← 切换 DiffView/FilesView/PlanView
   └─ <view>                  ← lazy(ChatView|DiffView|FilesView|GitView|PlanView|DiagramView|SettingsView|MultiRunWindow)
```

MainLayout 是**编排器**，本身不含业务逻辑；每个 view 才是业务页。

---

## 24 个原子原语的实际使用情况

| 原子 | 在业务组件中被引用 | 谁用得最重 |
|---|---|---|
| `button` | ✅ 14/20 feature | auth, chat, sections, session |
| `input` / `textarea` | ✅ 12/20 | sections（设置页）, chat, auth |
| `dialog` | ✅ 11/20 | desktop, auth, sections, session |
| `dropdown-menu` | ✅ 10/20 | desktop, session, mcp |
| `tooltip` | ✅ 10/20 | desktop, session, mcp, mini-chat |
| `toast` | ✅ 9/20 | update, auth, desktop, chat |
| `select` | ✅ 8/20 | sections（设置页） |
| `checkbox` | ✅ 5/20 | auth, sections/usage |
| `collapsible` | ✅ 3/20 | sections/usage |
| `context-menu` | ✅ 4/20 | sections, session/SidebarFilesTree |
| `ScrollableOverlay` | ✅ 6/20 | sections, chat 自动补全, model-picker |
| `ErrorBoundary` | ✅ 3/20 | MainLayout, Sidebar, VSCodeLayout |
| `Skeleton` | ✅ 1/20 | chat/ChatContainer |
| `ScrollShadow` | ✅ 1/20 | chat/ChatContainer |
| `Card` | ✅ 1/20 | chat/ChatErrorBoundary |
| `Sonner` / `Command` / `Switch` / `Radio` / `NumberInput` / `Text` / `Slot` / `OverlayScrollbar` | 几乎不直接用 | 由其它组合组件间接消费 |

→ **原子层利用率不均**。`button/input/dialog/dropdown/tooltip/toast` 是主力（10+ feature 用），其余基本闲置。这是正常现象 —— 原子层就应该"够用就好"，不为覆盖率而堆。

---

## 按 feature 分类（20 个）

### 🟢 纯组合（无业务耦合，可立即迁）

| Feature / 文件 | 组合 | 依赖 | omp-web 价值 |
|---|---|---|---|
| **icons/** (5/6) | 纯 SVG | 仅 `SVGProps` from 'react' | **高** — DiffIcon / McpIcon / StopIcon / FusionIcon / ArrowsMerge 直接当 lucide 补充 |
| **icon/Icon.tsx** | sprite 渲染器 | `cn` + 本地 sprite/icons | **中** — omp-web 已选 lucide-react，sprite 系统重复，但 OpenChamber 专属图标（如 McpIcon）需要 |
| **diagram/DiagramEditor.tsx** | `react-drawio` 嵌入 | 仅 `cn` | **低** — drawio 集成对 omp-web 不是必需 |
| **chat/ChatErrorBoundary.tsx** | `Button + Card` | useI18n + Icon | **高** — omp-web 通用错误边界，去 i18n 后可进 `apps/error-boundary/` |
| **chat/ChatSurfaceContext.tsx** | 1-prop Context | 零 | **高** — trivial |
| **chat/lib/** 整个子树（`shellBridge`、`messagePreview`、`turns/*`、`scroll/*`） | 纯函数 / 类型 | 无 React 无 store | **高** — turns projection cache 是 chat 性能关键 |
| **chat/markdown/**（`markdownCore`、`markdown-worker`、`markdown-shiki.worker`、`mermaidViewer`） | marked + Shiki + KaTeX + DOMPurify + web worker | 零 `@/stores` / `@/sync` import | **高** — Markdown 渲染管线，独立可迁 |
| **sections/shared/**（`SettingsPageLayout`、`SettingsSection`、`SettingsSidebarLayout`、`SettingsSidebarItem`、`SidebarGroup`、`SettingsFieldRow`、`SettingsInfoHint`、`SettingsProjectSelector`） | button/input/dialog/select + cn | 仅 useI18n | **极高** — 设置页骨架，几乎每个 settings 页都用 |

→ **P0 候选**：`sections/shared/` 全套 + `chat/lib/` + `chat/markdown/` + `icons/` SVG 子集 + `ChatErrorBoundary`。

---

### 🟡 轻耦合（依赖 1-3 个 store / lib，去耦成本低）

| Feature / 文件 | 组合 | 业务依赖 | 去耦策略 |
|---|---|---|---|
| **layout/Sidebar.tsx** (~150 LOC) | ErrorBoundary | useUIStore(sidebarWidth) + useI18n | 抽 `ResizableSidebar side=left\|right`，width 状态由 omp-web store 注入 |
| **layout/RightSidebar.tsx** | 同上 | 同上 | 同上（合并为一个组件） |
| **chat/components/ScrollToBottomButton** | Button | Icon + 1 hook | 直接迁 |
| **chat/components/PromptNavigatorRail** | Button | Icon + useI18n | 去 i18n |
| **chat/components/TurnItem / TurnActivity** | Button | Icon + 本地 hook | 直接迁 |
| **chat/PermissionCard.tsx** | Button | useSessionUIStore + useI18n | 接收 props 替代 store |
| **chat/QuestionCard.tsx** | Button + Textarea | 同上 | 同上 |
| **chat/message/MessageHeader.tsx** | Dropdown + Tooltip | useConfigStore + useI18n | 接收 props |
| **chat/ToolOutputDialog.tsx** | Dialog | useSessionUIStore | 接收 props |
| **session/ThinkingPill.tsx** | 自绘 | useI18n | 去 i18n |
| **session/ReviewFlowDialog.tsx** | Dialog + Button | useAutoReviewStore | 接收 props |
| **session/SessionSwitcherDropdown.tsx** | Dropdown | useGlobalSessionsStore | 接收 props |
| **session/SessionDialogs.tsx** | Dialog 聚合 | 几个 session 子 dialog | 拆成独立 dialog 迁 |
| **session/GitHubIntegrationDialog.tsx** | Dialog | useGitIdentitiesStore | 接收 props |
| **session/ArchiveAllDropdown.tsx** | Dropdown + Tooltip | Icon + useI18n | 直接迁 |
| **onboarding/** (10 文件) | Dialog + Button + Input | 仅 `lib/desktop` + `lib/desktopHosts` | 把 desktop lib 抽成接口注入 |
| **comments/** (7 文件) | Button + Tooltip + Dialog | useInlineCommentDraftStore + useSessionUIStore | 接收 props |
| **code/WorkerHighlightedCode.tsx** | Shiki worker | `chat/markdown/markdown-worker` | 等 markdown 子树迁完即可（P0 一起） |

→ **P1 候选**：上面这些等 P0 完成后按需迁，每个 ~30-200 LOC。

---

### 🔴 重耦合（依赖 5-15 个 store/sync/runtime，等 app 层建好）

| Feature | 为什么重 | omp-web 何时需要 |
|---|---|---|
| **chat/ChatContainer.tsx** | 聚合 MessageList + ChatInput + StatusRow + Permission/Question/Timeline + NavigatorRail + ScrollButton；wires 8 sync 模块 | omp-web 主对话界面建好时 |
| **chat/ChatInput.tsx** (~4200 LOC) | textarea + 4 个 autocomplete + model/agent picker + dictation + attachments + queue + review flow；15 stores + 7 sync 模块 | 最重的单文件，**重写优于迁移** |
| **chat/ChatMessage.tsx + MessageBody + parts/ToolPart** | useConfigStore + useFeatureFlagsStore + useUIStore + useContextStore + useSessionUIStore + useSelectionStore + useDeviceInfo + useThemeSystem | 等 message 渲染契约定型 |
| **chat/MessageList.tsx** | `@tanstack/react-virtual` + useTurnRecords + useGlobalSessionsStore + useSessionParts | 等虚拟列表 + turn 投影迁完 |
| **chat/TextSelectionMenu.tsx** | selection-store + 跨 iframe 通信 | omp-web 要做"选中即引用"功能时 |
| **chat/ChatEmptyState.tsx** | OpenChamberLogo + useGlobalSyncStore | 直接重写（新 logo） |
| **session/SessionSidebar.tsx** | DnD + 多选 + worktree + GitHub PR 状态 + runtime APIs；20+ store/hook imports | omp-web session 侧栏建好时 |
| **session/sidebar/SessionNodeItem.tsx** | DnD + 多选 + worktree | 同上 |
| **session/ProjectNotesTodoPanel.tsx** | 多 store | 低优先 |
| **session/DirectoryExplorerDialog.tsx** | 5 store + opencodeClient + MobileOverlayPanel | omp-web 接入 opencode 后 |
| **session/ForkSessionDialog.tsx** | 多 store | 同上 |
| **layout/MainLayout.tsx** (583 LOC) | 8 UIStore 字段 + useSessionUIStore + useDeviceInfo + DrawerProvider + DiffWorkerProvider + useUpdatePolling | 等 view 都迁好后再编 main shell |
| **layout/Header.tsx** (2675 LOC) | 9 store + SortableTabsStrip + ContextUsageDisplay + ProviderLogo + UpdateDialog + GitHub/quota/MCP/instance 菜单 | **重写优于迁移** |
| **layout/ContextPanel.tsx** | 切换 3 view + 6 store | 等 view 迁完 |
| **layout/RightSidebarTabs.tsx** | SortableTabsStrip + 4 store + 3 view | 同上 |
| **layout/SidebarFilesTree.tsx** | opencodeClient + 4 store + context-menu + dialog | 等文件树需求 |
| **layout/ProjectActionsButton.tsx** | 8+ openchamber 专属 deps（devServer 探测、terminal、SSH、relay） | 几乎要重写 |
| **layout/BottomTerminalDock.tsx** | terminal + terminal store | 等终端需求 |
| **views/** (45 文件) | 每个 view 是独立 page，wired to git/session/quota/multirun stores | 一个一个按需迁 |
| **multirun/** (6 文件) | 多 session 并行编排 | omp-web 要做多 run 时 |
| **sections/<feature>Page.tsx**（snippets/skills/agents/commands/mcp/plugins/usage 等 80 文件） | 每页 1 feature store + sections/shared 骨架 | 等 shared/ 迁完后逐个迁 |
| **update/** (3 文件) | useUpdateStore + safeStorage + platform + url | omp-web 自更新时 |
| **auth/SessionAuthGate.tsx** | WebAuthn + desktop + runtime + DesktopHostSwitcher + OpenChamberLogo + 多 auth lib | omp-web 要做鉴权时 |
| **desktop/** (3 文件) | Dialog + Input + Button + Tooltip + desktop hosts/relay/tunnel/openInApps runtime | 等桌面端 runtime 接入 |
| **terminal/TerminalViewport.tsx** | `ghostty-web`（Ghostty WASM） + terminalTheme + terminalTouchSelection + useTerminalStore | omp-web 终端需求 + 选定 terminal 引擎后 |
| **model-picker/ModelPickerList.tsx** | @dnd-kit/sortable + 7 lib imports + useModelPickerSectionsStore + ProviderLogo | 等 LLM provider 抽象层 |
| **mini-chat/MiniChatLayout.tsx** | 聚合 ChatContainer + 6 stores + WindowsWindowControls + ContextUsageDisplay | 等主 chat 迁完 |
| **mcp/McpDropdown.tsx** | dropdown + tooltip + switch + useMcpStore + useMcpConfigStore + McpIcon | omp-web MCP 集成时 |
| **dictation/ComposerDictation.tsx** | useDictation + useConfigStore + useUIStore + shortcuts + runtimeFetch | 语音输入功能时 |
| **providers/ThemeProvider.tsx** | 1 行 useUIStore 包装 | omp-web 已有自己的 theme 系统，**不迁** |

---

## 推荐迁移顺序

```
Phase 0  (已完成)
  └─ 24 个原子原语 → components/src/ui/

Phase 1  (🟢 现在就能做，不依赖任何 store)
  ├─ icons/ 的 5 个纯 SVG                    → components/src/icons/
  ├─ sections/shared/ 全套（8 文件）          → apps/settings/shared/  (去 i18n)
  ├─ chat/lib/（turns + scroll + projection） → apps/chat/lib/
  ├─ chat/markdown/（marked+Shiki+KaTeX）     → apps/chat/markdown/
  ├─ chat/ChatErrorBoundary                  → apps/chat/
  └─ chat/components/（ScrollBtn + NavigatorRail + TurnItem）

Phase 2  (🟡 等基础 store 到位：useUIStore / useSessionUIStore 雏形)
  ├─ layout/Sidebar + RightSidebar（合并为 ResizableSidebar）
  ├─ chat/PermissionCard + QuestionCard + ToolOutputDialog
  ├─ chat/message/MessageHeader
  ├─ session/dialogs 全套（Review/Switcher/GitHubIntegration/SessionDialogs）
  ├─ session/ThinkingPill + ArchiveAllDropdown
  ├─ comments/ (整组)
  ├─ onboarding/ (整组，desktop lib 抽接口)
  └─ code/WorkerHighlightedCode（依赖 Phase 1 的 markdown worker）

Phase 3  (🔴 等 app 层 + view pages 建好)
  ├─ chat/ChatContainer + MessageList + ChatMessage + MessageBody
  ├─ chat/ChatInput（建议重写，不复用 4200 LOC）
  ├─ session/SessionSidebar + SessionNodeItem
  ├─ views/* 全套（ChatView/DiffView/FilesView/GitView/PlanView/...）
  ├─ sections/*Page.tsx（按 feature 一个一个迁）
  └─ layout/MainLayout（最后编 shell）

Phase 4  (按需，看产品要不要)
  ├─ terminal/（需要先定 terminal 引擎：xterm vs ghostty）
  ├─ auth/（需要鉴权设计）
  ├─ update/（需要自更新基础设施）
  ├─ model-picker + providers（需要 LLM provider 抽象）
  ├─ mcp/ + dictation/ + multirun/ + mini-chat/
  └─ desktop/ + WindowsWindowControls（需要桌面端 runtime）
```

---

## 关键决策建议

1. **ChatInput 不要迁，重写** —— 4200 LOC + 15 store + 7 sync 模块，复制 = 复制技术债。omp-web 的输入框按自己契约从零写更便宜。
2. **Header 不要迁，重写** —— 2675 LOC + 9 store，且绑死 openchamber 品牌（ProviderLogo/UpdateDialog/ContextUsageDisplay）。omp-web 的顶部条从零写。
3. **sections/shared/ 是最高 ROI** —— 8 个文件，几乎所有设置页都用，去 i18n 后立即可用。
4. **chat/markdown/ 是独立子系统** —— marked + Shiki web worker + KaTeX + DOMPurify，零 store 依赖，独立迁移无障碍。
5. **icons/ 中的 5 个纯 SVG 可以立刻补到 lucide-react 旁边** —— DiffIcon、McpIcon、StopIcon、FusionIcon、ArrowsMerge 都是 openchamber 专属图标，lucide 里没有对应物。
6. **chat/lib/turns/ 投影缓存** —— 是 openchammer 性能的秘密武器（避免重渲染整个 message list），omp-web 做 chat 时务必参考。
7. **terminal 引擎** —— openchamber 用 `ghostty-web`（Ghostty WASM），omp-web 不一定要跟。可以考虑 xterm.js（更通用、生态更广）。

---

## 数据来源

- 3 个 scout 子 agent 并行扫描 chat/session/sections（ScoutChatSession）、layout/views/onboarding/comments（ScoutLayoutViews）、small features（ScoutSmallFeatures 失败，主 agent 手动 grep 补齐）
- 每个 file 的 import 语句都经过实际 grep 验证（`from '@/components/ui/'`、`from '@/stores/'`、`from '@/sync/'`、`useI18n`、`Icon` 等）
- 完整 scout 报告：`agent://ScoutChatSession`、`agent://ScoutLayoutViews`
