import { mergeRsbuildConfig } from '@rsbuild/core'
import type { StorybookConfig } from 'storybook-react-rsbuild'

// Storybook 10 + Rsbuild (React) 配置
// 文档: https://storybook.rsbuild.rs/guide/framework/react
// v10 起 essentials (docs / controls / actions / viewport / ...) 由 framework 内置，无需 addons 字段
const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../src/**/*.@(stories|mdx).@(ts|tsx|js|jsx|mjs|mjx)'],
  rsbuildFinal: (config) =>
    mergeRsbuildConfig(config, {
      // 在这里追加自定义 Rsbuild 配置（alias / define / plugin ...）
    }),
}

export default config
