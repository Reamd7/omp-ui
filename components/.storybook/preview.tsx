import * as React from 'react'
import type { Preview } from '@storybook/react'
// 全局样式：Tailwind v4 + 设计系统（语义令牌）+ base 层
import '../src/index.css'

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
    layout: 'centered',
    backgrounds: {
      // 让 Storybook 自带背景控件下线 — 由设计系统自己控制 bg-background
      disable: true,
      grid: { disable: true },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark 主题切换',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const isDark = ctx.globals.theme === 'dark'
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)
      }
      return <Story />
    },
  ],
}

export default preview
