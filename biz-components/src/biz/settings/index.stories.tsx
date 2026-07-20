import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Copy, Trash2, RefreshCw, Plus, Plug, FileCode, FileText } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  SettingsSection,
  SettingsFieldRow,
  SettingsStackedField,
  SettingsControlGroup,
  SettingsRadioGroup,
  SettingsRadioOption,
  SettingsCheckboxRow,
  SettingsInset,
  SettingsTwoColumn,
  SettingsChipGroup,
  SETTINGS_SECTION_TITLE_CLASS,
} from "./SettingsSection";
import { SettingsPageLayout } from "./SettingsPageLayout";
import { SettingsSidebarLayout } from "./SettingsSidebarLayout";
import { SettingsSidebarItem, type SettingsSidebarItemAction } from "./SettingsSidebarItem";

const meta = {
  title: "Biz/Settings/Shared",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * 完整设置页演示：SettingsPageLayout + SettingsSection + 各种字段类型
 */
export const FullPage: Story = {
  render: () => (
    <SettingsPageLayout
      title="Appearance"
      description="Customize how omp-web looks across surfaces."
      headerEnd={
        <Button size="sm" variant="ghost">
          Reset
        </Button>
      }
    >
      <SettingsSection title="Theme" description="Pick a color scheme.">
        <SettingsControlGroup>
          <SettingsRadioGroup aria-label="Theme">
            <SettingsRadioOption
              selected
              onSelect={() => {}}
              label="Warm Sand (default)"
              description="Daytime desert palette."
            />
            <SettingsRadioOption
              selected={false}
              onSelect={() => {}}
              label="Dark"
              description="For night owls and OLED screens."
            />
          </SettingsRadioGroup>
        </SettingsControlGroup>
      </SettingsSection>

      <SettingsSection
        title="Density"
        description="How tightly packed the UI feels."
        info="Compact reduces vertical spacing by ~30%. Useful on small screens."
      >
        <SettingsFieldRow label="Layout density">
          <SettingsChipGroup
            value="comfortable"
            aria-label="Density"
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ]}
            onChange={() => {}}
          />
        </SettingsFieldRow>

        <SettingsFieldRow label="Font size" description="In px. Applies to body copy.">
          <Input defaultValue="14" className="w-24" type="number" />
        </SettingsFieldRow>
      </SettingsSection>

      <SettingsSection title="Two-column example" divider>
        <SettingsTwoColumn>
          <SettingsStackedField label="Display name" description="Shown in comments.">
            <Input defaultValue="reamd" />
          </SettingsStackedField>
          <SettingsStackedField label="Bio">
            <Textarea defaultValue="Just a human." rows={2} />
          </SettingsStackedField>
        </SettingsTwoColumn>

        <SettingsInset>
          <SettingsCheckboxRow
            checked
            onChange={() => {}}
            label="Show online status"
            description="Others can see when you're active."
          />
          <SettingsCheckboxRow
            checked={false}
            onChange={() => {}}
            label="Allow @mentions"
            info="Mentions trigger notifications."
          />
        </SettingsInset>
      </SettingsSection>
    </SettingsPageLayout>
  ),
};

/** Plugin row icon — entry (npm package) vs file (plugin file)。模仿 openchamber PluginsSidebar 的 entryIcon 逻辑。 */
function PluginRowIcon({ kind, selected }: { kind: "npm" | "file"; selected: boolean }) {
  const Icon = kind === "npm" ? FileCode : FileText;
  return (
    <Icon
      className={cn(
        "h-4 w-4 flex-shrink-0",
        selected ? "text-foreground" : "text-muted-foreground/70",
      )}
    />
  );
}

/**
 * 复刻 openchamber sections/plugins/PluginsSidebar.tsx 的真实形态：
 *   - header: 静态 h2 标题 + Total 计数 + 2 个 icon 按钮（refresh / add）
 *   - 列表分组: 纯文字 div "User config" / "User plugin file"（不折叠）
 *   - item: SettingsSidebarItem with icon + title + metadata + per-item dropdown actions
 *   - 右侧详情区: empty state "Select a plugin to view or edit"
 *
 * biz 边界：所有 opencode/openchamber 业务耦合（store / sync / i18n / SDK）
 * 已剥离；调用方注入 props（plugins 列表 / selectedId / callbacks）即可使用。
 */
export const SidebarLayout: Story = {
  name: "Sidebar Layout (PluginsSidebar style)",
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    // Demo data — 模仿 openchamber PluginsSidebar 的 plugin entry + plugin file 两类
    type PluginEntry = { id: string; name: string; kind: "npm" | "file"; meta: string };
    const entries: PluginEntry[] = [
      { id: "p1", name: "oh-my-openagent", kind: "npm", meta: "npm package" },
    ];
    const files: PluginEntry[] = [
      { id: "f1", name: "opencode-loop.js", kind: "file", meta: "Plugin file" },
    ];
    const total = entries.length + files.length;

    const itemActions: SettingsSidebarItemAction[] = [
      { label: "Edit", icon: Copy, onClick: () => {} },
      { label: "Delete", icon: Trash2, onClick: () => {}, destructive: true },
    ];

    const renderPluginRow = (plugin: PluginEntry) => {
      const isSelected = selectedId === plugin.id;
      return (
        <SettingsSidebarItem
          key={plugin.id}
          title={plugin.name}
          metadata={plugin.meta}
          icon={<PluginRowIcon kind={plugin.kind} selected={isSelected} />}
          selected={isSelected}
          onSelect={() => setSelectedId(plugin.id)}
          actions={itemActions}
        />
      );
    };

    return (
      <div className="flex h-[640px] w-full overflow-hidden rounded-md border border-border bg-background">
        <div className="flex h-full min-h-0">
          {/* 外层 sidebar 容器（仿 PluginsPage 提供的 w-280 border-r 外壳） */}
          <aside
            className="flex h-full flex-col border-r border-border bg-muted"
            style={{ width: 280, minWidth: 280 }}
          >
            <SettingsSidebarLayout
              variant="background"
              header={
                <div className="border-b border-border/60 px-3 pb-3 pt-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className={SETTINGS_SECTION_TITLE_CLASS}>Plugins</h2>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm leading-[1.45] text-muted-foreground">
                      Total {total}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        data-settings-item="plugins.refresh"
                        variant="ghost"
                        size="icon"
                        className="-my-1 h-7 w-7 text-muted-foreground"
                        onClick={() => {
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 1200);
                        }}
                        disabled={isRefreshing}
                        aria-label="Check for updates"
                        title="Check for updates"
                      >
                        <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="-my-1 h-7 w-7 text-muted-foreground"
                        onClick={() => {}}
                        aria-label="Add plugin"
                        title="Add plugin"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              }
            >
              {/* 分组 label —— 纯文字，不用 SidebarGroup（不可折叠，跟 openchamber 一致） */}
              <div className="pb-1.5 px-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User config
              </div>
              {entries.map(renderPluginRow)}

              <div className="pb-1.5 px-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User plugin file
              </div>
              {files.map(renderPluginRow)}
            </SettingsSidebarLayout>
          </aside>

          {/* 右侧详情区：未选中时的 empty state（仿 PluginsPage 右侧） */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-background">
            <div className="text-center text-muted-foreground">
              <Plug className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="text-sm">Select a plugin to view or edit</p>
              <p className="mt-1 text-xs opacity-75">Or click + to add a new plugin</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 单独展示 SettingsInfoHint（带 hover/click 触发的 tooltip）
 */
export const InfoHint: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6 p-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Cache size</span>
        {/* InfoHint 在这里 */}
      </div>
      <SettingsSection title="Demo" description="Hover or click the info icon.">
        <SettingsFieldRow
          label="Cache size"
          info="Cached responses speed up regeneration but consume disk space. Recommended: 100–500 MB."
        >
          <Input defaultValue="100" className="w-24" type="number" />
        </SettingsFieldRow>
      </SettingsSection>
    </div>
  ),
};
