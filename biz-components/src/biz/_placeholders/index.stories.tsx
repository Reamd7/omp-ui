import type { Meta, StoryObj } from "@storybook/react";
import { ComingSoon } from "./ComingSoon";

const meta = {
  title: "Biz/_placeholders",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── Phase 3 — chat/ 重耦合 ─────────────────────────────────────────────────

export const ChatContainer: Story = {
  name: "Phase 3 — chat/ChatContainer",
  render: () => (
    <ComingSoon
      name="ChatContainer"
      source="chat/ChatContainer.tsx"
      phase="3"
      reason="聚合 MessageList + ChatInput + StatusRow + Permission/Question Card + Timeline + NavigatorRail + ScrollButton，wires 8 sync 模块。"
      when="omp-web 主对话界面 + sync 层建好后"
      coupling={[
        "useUIStore",
        "useSessionUIStore",
        "useGlobalSyncStore",
        "useChatAutoFollow",
        "8 sync modules",
      ]}
      linesOfCode={450}
    />
  ),
};

export const ChatInput: Story = {
  name: "Phase 3 — chat/ChatInput (建议重写)",
  render: () => (
    <ComingSoon
      name="ChatInput"
      source="chat/ChatInput.tsx"
      phase="3"
      reason="最重的单文件，4200 LOC + textarea + 4 个 autocomplete (File/Command/Skill/Snippet) + model/agent picker + dictation + attachments + queue + review flow；15 store + 7 sync 模块。"
      when="omp-web 输入框契约定型时"
      coupling={[
        "useInputStore",
        "useConfigStore",
        "useSessionUIStore",
        "15 stores",
        "7 sync modules",
      ]}
      linesOfCode={4200}
      strategy="rewrite"
    />
  ),
};

export const ChatMessage: Story = {
  name: "Phase 3 — chat/ChatMessage + MessageBody + ToolPart",
  render: () => (
    <ComingSoon
      name="ChatMessage / MessageBody / parts/ToolPart"
      source="chat/ChatMessage.tsx + chat/message/MessageBody.tsx + chat/message/parts/ToolPart.tsx"
      phase="3"
      reason="useConfigStore + useFeatureFlagsStore + useUIStore + useContextStore + useSessionUIStore + useSelectionStore + useDeviceInfo + useThemeSystem 全套 hook 接入。"
      when="message 渲染契约定型后"
      coupling={["useConfigStore", "useFeatureFlagsStore", "useContextStore", "useSelectionStore"]}
      linesOfCode={1500}
    />
  ),
};

export const MessageList: Story = {
  name: "Phase 3 — chat/MessageList",
  render: () => (
    <ComingSoon
      name="MessageList"
      source="chat/MessageList.tsx"
      phase="3"
      reason="@tanstack/react-virtual + useTurnRecords + useGlobalSessionsStore + useSessionParts，依赖 turn 投影缓存子系统。"
      when="虚拟列表 + turn 投影迁完后"
      coupling={[
        "@tanstack/react-virtual",
        "useGlobalSessionsStore",
        "useSessionParts",
        "useTurnRecords",
      ]}
      linesOfCode={800}
    />
  ),
};

export const TextSelectionMenu: Story = {
  name: "Phase 3 — chat/TextSelectionMenu",
  render: () => (
    <ComingSoon
      name="TextSelectionMenu"
      source="chat/TextSelectionMenu.tsx"
      phase="3"
      reason="selection-store + 跨 iframe 通信，需要选中即引用子系统。"
      when="omp-web 要做选中即引用功能时"
      coupling={["useSelectionStore", "iframe bridge"]}
      linesOfCode={400}
    />
  ),
};

export const ChatEmptyState: Story = {
  name: "Phase 3 — chat/ChatEmptyState",
  render: () => (
    <ComingSoon
      name="ChatEmptyState"
      source="chat/ChatEmptyState.tsx"
      phase="3"
      reason="绑死 OpenChamberLogo + useGlobalSyncStore；直接重写（新 logo + 新文案）。"
      when="omp-web 主对话界面建好时"
      coupling={["OpenChamberLogo", "useGlobalSyncStore"]}
      linesOfCode={120}
      strategy="rewrite"
    />
  ),
};

// ─── Phase 3 — session/ 重耦合 ──────────────────────────────────────────────

export const SessionSidebar: Story = {
  name: "Phase 3 — session/SessionSidebar",
  render: () => (
    <ComingSoon
      name="SessionSidebar"
      source="session/SessionSidebar.tsx"
      phase="3"
      reason="DnD + 多选 + worktree + GitHub PR 状态 + runtime APIs；20+ store/hook imports。"
      when="omp-web session 侧栏建好时"
      coupling={["20+ store/hook imports", "DnD", "worktree", "GitHub PR"]}
      linesOfCode={600}
    />
  ),
};

export const SessionNodeItem: Story = {
  name: "Phase 3 — session/sidebar/SessionNodeItem",
  render: () => (
    <ComingSoon
      name="SessionNodeItem"
      source="session/sidebar/SessionNodeItem.tsx"
      phase="3"
      reason="DnD + 多选 + worktree，与 SessionSidebar 配套。"
      when="SessionSidebar 迁移时"
      coupling={["DnD", "multi-select", "worktree"]}
      linesOfCode={300}
    />
  ),
};

export const ProjectNotesTodoPanel: Story = {
  name: "Phase 3 — session/ProjectNotesTodoPanel",
  render: () => (
    <ComingSoon
      name="ProjectNotesTodoPanel"
      source="session/ProjectNotesTodoPanel.tsx"
      phase="3"
      reason="多 store 聚合，低优先。"
      when="等其它 session 组件迁完"
      coupling={["multiple stores"]}
      linesOfCode={250}
    />
  ),
};

export const DirectoryExplorerDialog: Story = {
  name: "Phase 3 — session/DirectoryExplorerDialog",
  render: () => (
    <ComingSoon
      name="DirectoryExplorerDialog"
      source="session/DirectoryExplorerDialog.tsx"
      phase="3"
      reason="5 store + opencodeClient + MobileOverlayPanel。"
      when="omp-web 接入 opencode 后"
      coupling={["5 stores", "opencodeClient", "MobileOverlayPanel"]}
      linesOfCode={400}
    />
  ),
};

export const ForkSessionDialog: Story = {
  name: "Phase 3 — session/ForkSessionDialog",
  render: () => (
    <ComingSoon
      name="ForkSessionDialog"
      source="session/ForkSessionDialog.tsx"
      phase="3"
      reason="多 store 聚合。"
      when="omp-web 接入 opencode 后"
      coupling={["multiple stores"]}
      linesOfCode={200}
    />
  ),
};

// ─── Phase 3 — layout/ 重耦合 ───────────────────────────────────────────────

export const MainLayout: Story = {
  name: "Phase 3 — layout/MainLayout",
  render: () => (
    <ComingSoon
      name="MainLayout"
      source="layout/MainLayout.tsx"
      phase="3"
      reason="583 LOC 编排器；8 UIStore 字段 + useSessionUIStore + useDeviceInfo + DrawerProvider + DiffWorkerProvider + useUpdatePolling。"
      when="所有 view 都迁好后再编 main shell"
      coupling={[
        "useUIStore (8 fields)",
        "useSessionUIStore",
        "DrawerProvider",
        "DiffWorkerProvider",
      ]}
      linesOfCode={583}
    />
  ),
};

export const Header: Story = {
  name: "Phase 3 — layout/Header (建议重写)",
  render: () => (
    <ComingSoon
      name="Header"
      source="layout/Header.tsx"
      phase="3"
      reason="2675 LOC tabstrip + 窗口控件 + GitHub/quota/MCP/instance 菜单；9 store + 绑死 openchamber 品牌（ProviderLogo/UpdateDialog/ContextUsageDisplay）。"
      when="omp-web 顶部条定型时"
      coupling={[
        "9 stores",
        "SortableTabsStrip",
        "ProviderLogo",
        "UpdateDialog",
        "ContextUsageDisplay",
      ]}
      linesOfCode={2675}
      strategy="rewrite"
    />
  ),
};

export const ContextPanel: Story = {
  name: "Phase 3 — layout/ContextPanel",
  render: () => (
    <ComingSoon
      name="ContextPanel"
      source="layout/ContextPanel.tsx"
      phase="3"
      reason="切换 DiffView/FilesView/PlanView + 6 store。"
      when="三个 view 迁完后"
      coupling={["6 stores", "DiffView", "FilesView", "PlanView"]}
      linesOfCode={400}
    />
  ),
};

export const RightSidebarTabs: Story = {
  name: "Phase 3 — layout/RightSidebarTabs",
  render: () => (
    <ComingSoon
      name="RightSidebarTabs"
      source="layout/RightSidebarTabs.tsx"
      phase="3"
      reason="SortableTabsStrip + 4 store + 3 view。"
      when="view 迁完后"
      coupling={["SortableTabsStrip", "4 stores", "3 views"]}
      linesOfCode={200}
    />
  ),
};

export const SidebarFilesTree: Story = {
  name: "Phase 3 — layout/SidebarFilesTree",
  render: () => (
    <ComingSoon
      name="SidebarFilesTree"
      source="layout/SidebarFilesTree.tsx"
      phase="3"
      reason="opencodeClient + 4 store + context-menu + dialog。"
      when="等文件树需求"
      coupling={["opencodeClient", "4 stores"]}
      linesOfCode={350}
    />
  ),
};

export const ProjectActionsButton: Story = {
  name: "Phase 3 — layout/ProjectActionsButton",
  render: () => (
    <ComingSoon
      name="ProjectActionsButton"
      source="layout/ProjectActionsButton.tsx"
      phase="3"
      reason="8+ openchamber 专属 deps（devServer 探测、terminal、SSH、relay）—— 几乎要重写。"
      when="omp-web runtime 设计完成后"
      coupling={["devServer probe", "terminal store", "SSH", "relay"]}
      linesOfCode={250}
      strategy="rewrite"
    />
  ),
};

export const BottomTerminalDock: Story = {
  name: "Phase 3 — layout/BottomTerminalDock",
  render: () => (
    <ComingSoon
      name="BottomTerminalDock"
      source="layout/BottomTerminalDock.tsx"
      phase="3"
      reason="terminal + terminal store。"
      when="等终端需求"
      coupling={["terminal store", "TerminalViewport"]}
      linesOfCode={150}
    />
  ),
};

// ─── Phase 3 — views/ ───────────────────────────────────────────────────────

const viewStory = (name: string, reason: string, loc: number, deps: string[]): Story => ({
  name: `Phase 3 — views/${name}`,
  render: () => (
    <ComingSoon
      name={name}
      source={`views/${name}.tsx`}
      phase="3"
      reason={reason}
      when="一个一个按需迁"
      coupling={deps}
      linesOfCode={loc}
    />
  ),
});

export const ChatView = viewStory(
  "ChatView",
  "聚合 ChatContainer + 多 store，依赖 chat 子系统全部迁完。",
  300,
  ["ChatContainer", "useSessionUIStore"],
);
export const DiffView = viewStory(
  "DiffView",
  "git store + diff worker + DiffWorkerProvider。",
  500,
  ["useGitStore", "DiffWorkerProvider"],
);
export const FilesView = viewStory("FilesView", "file tree store + 多 view-tabs。", 400, [
  "useFilesViewTabsStore",
]);
export const GitView = viewStory("GitView", "git store + GitHub auth + identities。", 600, [
  "useGitStore",
  "useGitIdentitiesStore",
  "GitHubAuth",
]);
export const PlanView = viewStory("PlanView", "plan store + plan rendering。", 350, ["plan store"]);
export const DiagramView = viewStory("DiagramView", "DiagramEditor + drawio 状态。", 200, [
  "DiagramEditor",
]);
export const SettingsView = viewStory("SettingsView", "settings pages 路由聚合。", 200, [
  "settings router",
]);
export const MultiRunWindow = viewStory("MultiRunWindow", "multirun 编排 + 多 chat 嵌入。", 300, [
  "multirun store",
]);

// ─── Phase 3 — multirun/ + sections/*Page ───────────────────────────────────

export const MultirunGroup: Story = {
  name: "Phase 3 — multirun/ (6 文件整组)",
  render: () => (
    <ComingSoon
      name="multirun/ (整组 6 文件)"
      source="multirun/*"
      phase="3"
      reason="多 session 并行编排 + runtime APIs。"
      when="omp-web 要做多 run 时"
      coupling={["runtime APIs", "session orchestration"]}
      linesOfCode={600}
    />
  ),
};

export const SectionsPages: Story = {
  name: "Phase 3 — sections/*Page (80 文件)",
  render: () => (
    <ComingSoon
      name="sections/*Page (80 文件)"
      source="sections/{snippets,skills,agents,commands,mcp,plugins,usage}Page.tsx 等"
      phase="3"
      reason="每页 1 feature store + sections/shared 骨架。80 个文件按 feature 一个一个迁。"
      when="等 shared/ 迁完后逐个迁（shared 已在 Phase 1 完成）"
      coupling={[
        "per-feature store (useSnippetsStore/useAgentsStore/useCommandsStore/useMcpStore/useSkillsStore/usePluginsStore/useQuotaStore)",
      ]}
      linesOfCode={3000}
    />
  ),
};

// ─── Phase 4 (按需) ──────────────────────────────────────────────────────────

const phase4Story = (
  name: string,
  source: string,
  reason: string,
  when: string,
  deps: string[],
  loc: number,
  strategy: "rewrite" | "migrate" | "skip" = "migrate",
): Story => ({
  name: `Phase 4 — ${source.split("/")[0]}/${name}`,
  render: () => (
    <ComingSoon
      name={name}
      source={source}
      phase="4"
      reason={reason}
      when={when}
      coupling={deps}
      linesOfCode={loc}
      strategy={strategy}
    />
  ),
});

export const TerminalViewport = phase4Story(
  "TerminalViewport",
  "terminal/TerminalViewport.tsx",
  "ghostty-web (Ghostty WASM) + terminalTheme + terminalTouchSelection + useTerminalStore。",
  "omp-web 终端需求 + 选定 terminal 引擎后（可考虑 xterm.js 替代）",
  ["ghostty-web", "terminalTheme", "useTerminalStore"],
  300,
);

export const SessionAuthGate = phase4Story(
  "SessionAuthGate",
  "auth/SessionAuthGate.tsx",
  "WebAuthn + desktop + runtime + DesktopHostSwitcher + OpenChamberLogo + 多 auth lib。",
  "omp-web 要做鉴权时",
  ["@simplewebauthn/browser", "runtime", "DesktopHostSwitcher"],
  400,
);

export const UpdateToasts = phase4Story(
  "MobileAppUpdateToast + OpenCodeUpdateToast",
  "update/*",
  "useUpdateStore + safeStorage + platform + url —— 应用自更新基础设施。",
  "omp-web 自更新时",
  ["useUpdateStore", "safeStorage"],
  250,
);

export const DesktopGroup = phase4Story(
  "DesktopHostSwitcher + OpenInAppButton + WindowsWindowControls",
  "desktop/*",
  "Dialog + Input + Button + Tooltip + desktop hosts/relay/tunnel/openInApps runtime。",
  "等桌面端 runtime 接入",
  ["desktop hosts", "relay", "tunnel", "openInApps"],
  400,
);

export const ModelPickerList = phase4Story(
  "ModelPickerList",
  "model-picker/ModelPickerList.tsx",
  "@dnd-kit/sortable + 7 lib imports + useModelPickerSectionsStore + ProviderLogo。",
  "等 LLM provider 抽象层",
  ["@dnd-kit/sortable", "useModelPickerSectionsStore", "ProviderLogo"],
  300,
);

export const MiniChatLayout = phase4Story(
  "MiniChatLayout",
  "mini-chat/MiniChatLayout.tsx",
  "聚合 ChatContainer + 6 stores + WindowsWindowControls + ContextUsageDisplay。",
  "等主 chat 迁完",
  ["ChatContainer", "6 stores", "WindowsWindowControls"],
  200,
);

export const McpDropdown = phase4Story(
  "McpDropdown",
  "mcp/McpDropdown.tsx",
  "dropdown + tooltip + switch + useMcpStore + useMcpConfigStore + McpIcon。",
  "omp-web MCP 集成时",
  ["useMcpStore", "useMcpConfigStore", "McpIcon"],
  200,
);

export const ComposerDictation = phase4Story(
  "ComposerDictation",
  "dictation/ComposerDictation.tsx",
  "useDictation + useConfigStore + useUIStore + shortcuts + runtimeFetch —— 语音输入。",
  "语音输入功能时",
  ["useDictation", "shortcuts lib"],
  150,
);

// ─── Deferred (was Phase 1, too heavy) ──────────────────────────────────────

export const MarkdownRenderer = phase4Story(
  "MarkdownRenderer",
  "chat/markdown/MarkdownRendererImpl.tsx",
  "1245 LOC + marked + Shiki web worker + KaTeX + DOMPurify + morphdom + mermaid。",
  "独立任务（安装 marked/shiki/katex/dompurify + 配 worker）",
  ["marked", "shiki worker", "katex", "dompurify", "morphdom", "mermaid"],
  1245,
);
