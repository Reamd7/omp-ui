import type { Preview } from 'storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 全局背景 / 字体 / 主题留待后续接入 openchamber 设计系统时再细化
    layout: 'centered',
  },
  // 全局 decorator 在此添加
}

export default preview
