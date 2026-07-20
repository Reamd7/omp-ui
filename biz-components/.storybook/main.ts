/* oxlint-disable no-shadow, import/no-unassigned-import -- storybook config & CSS side-effect imports */
import { mergeRsbuildConfig } from "@rsbuild/core";
import type { StorybookConfig } from "storybook-react-rsbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Storybook 10 + Rsbuild (React) 配置
// 文档: https://storybook.rsbuild.rs/guide/framework/react
// v10 起 essentials (docs / controls / actions / viewport / ...) 由 framework 内置，无需 addons 字段
//
// Alias 策略：
//   @/*           → ./src/*          （本包自身源码）
//   @components/* → ../components/src/* （跨 workspace 直接读 components 源码，无需 build）
//
// 用 node:path + import.meta.url 算出绝对路径，避免 Windows 下盘符 / 斜杠问题。
const projectRoot = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  framework: "storybook-react-rsbuild",
  stories: ["../src/**/*.@(stories|mdx).@(ts|tsx|js|jsx|mjs|mjx)"],
  rsbuildFinal: (config) =>
    mergeRsbuildConfig(config, {
      source: {
        alias: {
          "@": resolve(projectRoot, "../src"),
          "@components": resolve(projectRoot, "../../components/src"),
        },
      },
      tools: {
        swc: {
          jsc: {
            transform: {
              react: {
                // 强制 React 17+ automatic JSX runtime：避免 classic runtime
                // 下漏写 `import React` 就崩 "React is not defined"
                runtime: "automatic",
              },
            },
          },
        },
      },
    }),
};

export default config;
