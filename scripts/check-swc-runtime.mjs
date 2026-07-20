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
 *
 * 覆盖范围：所有 workspace 包的 .storybook/main.ts（components + biz-components + 未来新增）。
 * 自动发现：扫描 pnpm-workspace.yaml 里列出的包目录。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

/** 读 pnpm-workspace.yaml 的 packages 列表，挑出本地目录（非 glob）作为 workspace 根 */
function discoverWorkspaces() {
  const yaml = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8')
  const packages = []
  for (const line of yaml.split('\n')) {
    const m = /^\s*-\s*['"]?([^'"\s]+)['"]?/.exec(line)
    if (!m) continue
    const name = m[1]
    // 只挑直接目录名（不含 * / /），跳过通配符（'packages/*'）
    if (name.includes('*') || name.includes('/')) continue
    const abs = resolve(root, name)
    try {
      if (statSync(abs).isDirectory()) packages.push({ name, abs })
    } catch {
      // 目录不存在跳过
    }
  }
  return packages
}

const workspaces = discoverWorkspaces()
const targets = []
for (const { name, abs } of workspaces) {
  const mainTs = join(abs, '.storybook/main.ts')
  try {
    readFileSync(mainTs) // 触发 ENOENT 如果不存在
    targets.push({ name, mainTs })
  } catch {
    // 这个 workspace 没有 .storybook 配置，跳过
  }
}

if (targets.length === 0) {
  console.error('❌ P1: 没找到任何 workspace 的 .storybook/main.ts')
  console.error('   至少需要有一个 Storybook 配置来强制 automatic JSX runtime。')
  process.exit(1)
}

let failed = false
for (const { name, mainTs } of targets) {
  let content
  try {
    content = readFileSync(mainTs, 'utf8')
  } catch (err) {
    console.error(`❌ P1: [${name}] 读取失败: ${err.message}`)
    failed = true
    continue
  }

  const errors = []
  if (!/transform:\s*\{/.test(content)) errors.push(`缺 tools.swc.jsc.transform 块`)
  if (!/react:\s*\{/.test(content)) errors.push(`缺 jsc.transform.react 块`)
  if (!/runtime:\s*['"]automatic['"]/.test(content)) errors.push(`runtime 必须为 'automatic'`)

  if (errors.length > 0) {
    console.error(`❌ P1: [${name}] ${mainTs} 必须强制配置 automatic JSX runtime`)
    console.error('   背景：Rsbuild v2 默认 classic runtime 会让所有 Storybook story 报')
    console.error('   "ReferenceError: React is not defined"，必须在 main.ts 的 rsbuildFinal 里配')
    console.error('   tools.swc.jsc.transform.react.runtime = "automatic"。')
    console.error('   问题：')
    errors.forEach((e) => console.error(`   - ${e}`))
    failed = true
  } else {
    console.log(`✅ P1: [${name}] storybook swc react runtime = automatic`)
  }
}

if (failed) process.exit(1)
