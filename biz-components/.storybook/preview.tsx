/* oxlint-disable import/no-unassigned-import -- CSS side-effect imports are intentional */
import * as React from "react";
import type { Preview } from "@storybook/react";
// 全局样式：直接复用 @omp-web/components 的 index.css（Tailwind v4 + 设计系统 + base 层）
// 通过 workspace 协议解析到 ../components/src/index.css，无需重复维护设计令牌。
import "@omp-web/components/styles.css";
// 本包 Tailwind 扫描入口（声明 @source 让 Tailwind 扫到 biz-components 自己的源码）
import "../src/index.css";

/**
 * bright/dark 两套主题通过工具栏的 globals.theme 切换。
 * 切换时给 <html> 加/去 .dark 类（与 design-system.css 的 @custom-variant dark 对应）。
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      // 让 Storybook 自带背景控件下线 — 由设计系统自己控制 bg-background
      disable: true,
      grid: { disable: true },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light / Dark 主题切换",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const isDark = ctx.globals.theme === "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", isDark);
      }
      return <Story />;
    },
  ],
};

export default preview;
