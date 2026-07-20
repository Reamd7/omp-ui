#!/usr/bin/env node
/**
 * P1 invariant: .storybook/main.ts 必须配 tools.swc.jsc.transform.react.runtime = 'automatic'
 *
 * 历史背景：Rsbuild v2 默认 classic JSX runtime，会导致所有 Storybook story 在运行时
 * 报 "ReferenceError: React is not defined"（特别是 .storybook/preview.tsx 的 decorator
 * 包裹所有 story，一处漏 React 值 import 就全员崩）。
 *
 * 治本：让 Rsbuild 用 automatic runtime，编译成 react/jsx-runtime，不再需要 React 值绑定。
 * 这个脚本断言该配置恒在 —— 一旦被人删/改回 classic，pre-commit 直接 fail。
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const mainTsPath = resolve(root, 'components/.storybook/main.ts')

let content
try {
  content = readFileSync(mainTsPath, 'utf8')
} catch (err) {
  console.error(`❌ P1: 找不到 ${mainTsPath}`)
  console.error('   Storybook 配置文件必须存在且配置 automatic JSX runtime。')
  process.exit(1)
}

const errors = []

// 必须出现 transform: { ... } 块
if (!/transform:\s*\{/.test(content)) {
  errors.push(`缺 tools.swc.jsc.transform 块`)
}
// 必须出现 react: { ... } 块
if (!/react:\s*\{/.test(content)) {
  errors.push(`缺 jsc.transform.react 块`)
}
// 必须出现 runtime: 'automatic'（允许单/双引号）
if (!/runtime:\s*['"]automatic['"]/.test(content)) {
  errors.push(`runtime 必须为 'automatic'（当前不是）`)
}

if (errors.length > 0) {
  console.error(`❌ P1: components/.storybook/main.ts 必须强制配置 automatic JSX runtime`)
  console.error(`   背景：Rsbuild v2 默认 classic runtime 会让所有 Storybook story 报`)
  console.error(`   "ReferenceError: React is not defined"，必须在 main.ts 的 rsbuildFinal 里配`)
  console.error(`   tools.swc.jsc.transform.react.runtime = 'automatic'。`)
  console.error(`   问题：`)
  errors.forEach((e) => console.error(`   - ${e}`))
  process.exit(1)
}

console.log('✅ P1: storybook swc react runtime = automatic')
