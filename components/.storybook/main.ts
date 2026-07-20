import { mergeRsbuildConfig } from "@rsbuild/core";
import type { StorybookConfig } from "storybook-react-rsbuild";

// Storybook 10 + Rsbuild (React) 配置
// 文档: https://storybook.rsbuild.rs/guide/framework/react
// v10 起 essentials (docs / controls / actions / viewport / ...) 由 framework 内置，无需 addons 字段
const config: StorybookConfig = {
  framework: "storybook-react-rsbuild",
  stories: ["../src/**/*.@(stories|mdx).@(ts|tsx|js|jsx|mjs|mjx)"],
  rsbuildFinal: (config) =>
    mergeRsbuildConfig(config, {
      source: {
        alias: {
          "@": new URL("./../src", import.meta.url).pathname,
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
