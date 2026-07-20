import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button";
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
} from "./SettingsSection";
import { SettingsPageLayout } from "./SettingsPageLayout";
import { SettingsSidebarLayout } from "./SettingsSidebarLayout";
import { SettingsSidebarItem, type SettingsSidebarItemAction } from "./SettingsSidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { SettingsProjectSelector, type ProjectOption } from "./SettingsProjectSelector";

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

/**
 * 侧栏布局：SettingsSidebarLayout + SettingsSidebarItem + SidebarGroup
 */
export const SidebarLayout: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("item-1");
    const [projects] = React.useState<ProjectOption[]>([
      { id: "p1", label: "omp-web", path: "/work/omp-web" },
      { id: "p2", label: "omp-ui", path: "/work/omp-ui" },
      { id: "p3", path: "/work/side-project" },
    ]);
    const [activeProject, setActiveProject] = React.useState<string | null>("p1");

    const actions: SettingsSidebarItemAction[] = [
      { label: "Duplicate", icon: Copy, onClick: () => {} },
      { label: "Delete", icon: Trash2, onClick: () => {}, destructive: true },
    ];

    return (
      <div className="flex h-[640px] w-full gap-4 p-4">
        <div className="w-72">
          <SettingsSidebarLayout
            header={
              <div className="border-b border-border/60 p-3">
                <SettingsProjectSelector
                  projects={projects}
                  activeProjectId={activeProject}
                  onSelectProject={setActiveProject}
                />
              </div>
            }
          >
            <SidebarGroup label="snippets" count={3} storageKey="story">
              <SettingsSidebarItem
                title="summarize.ts"
                metadata="Edited 2h ago"
                selected={selected === "item-1"}
                onSelect={() => setSelected("item-1")}
                actions={actions}
              />
              <SettingsSidebarItem
                title="translate.ts"
                metadata="Edited yesterday"
                selected={selected === "item-2"}
                onSelect={() => setSelected("item-2")}
              />
              <SettingsSidebarItem
                title="refactor.ts"
                selected={selected === "item-3"}
                onSelect={() => setSelected("item-3")}
              />
            </SidebarGroup>
            <SidebarGroup label="skills" count={2} storageKey="story" defaultExpanded={false}>
              <SettingsSidebarItem
                title="code-review"
                selected={selected === "item-4"}
                onSelect={() => setSelected("item-4")}
              />
              <SettingsSidebarItem
                title="tdd-loop"
                selected={selected === "item-5"}
                onSelect={() => setSelected("item-5")}
              />
            </SidebarGroup>
          </SettingsSidebarLayout>
        </div>

        <div className="flex-1 rounded-md border border-border p-4">
          <p className="text-sm text-muted-foreground">Selected: {selected}</p>
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
