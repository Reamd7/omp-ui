#!/usr/bin/env node
/**
 * P7 invariant: 禁止 openchamber 自定义类 .typography-* 残留
 *
 * 历史背景：openchamber 用 .typography-markdown / .typography-ui-label / .typography-meta
 * 等自定义 CSS 类（定义在它自己的 typography.css 里）。本项目没有这些类定义，子 agent
 * 复制 openchamber 组件时容易把它们带过来，导致 Tailwind 找不到类、样式静默失效。
 *
 * 规则：所有 .typography-* 引用一律替换为标准 Tailwind utility（text-sm / font-medium 等）。
 * 扫描范围：所有 workspace 包的 src 下（components + biz-components + 未来新增）。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

/** 读 pnpm-workspace.yaml 的 packages 列表，挑出本地目录作为 workspace 根 */
function discoverWorkspaces() {
  const yaml = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8')
  const list = []
  for (const line of yaml.split('\n')) {
    const m = /^\s*-\s*['"]?([^'"\s]+)['"]?/.exec(line)
    if (!m) continue
    const name = m[1]
    if (name.includes('*') || name.includes('/')) continue
    const abs = resolve(root, name)
    try {
      if (statSync(abs).isDirectory()) list.push({ name, abs })
    } catch {
      // 目录不存在跳过
    }
  }
  return list
}

const PATTERN = /\btypography-[a-z-]+/g
const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.jsx', '.js', '.mjs'])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      yield* walk(full)
    } else if (EXTENSIONS.has(extOf(full))) {
      yield full
    }
  }
}

function extOf(p) {
  const i = p.lastIndexOf('.')
  return i === -1 ? '' : p.slice(i)
}

const hits = []
for (const { name, abs } of discoverWorkspaces()) {
  const srcDir = join(abs, 'src')
  try {
    statSync(srcDir)
  } catch {
    continue // 这个 workspace 没有 src/，跳过
  }
  for (const file of walk(srcDir)) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const matches = line.match(PATTERN)
      if (matches) {
        for (const m of matches) {
          hits.push({
            workspace: name,
            file: relative(root, file),
            line: i + 1,
            match: m,
            snippet: line.trim().slice(0, 120),
          })
        }
      }
    }
  }
}

if (hits.length > 0) {
  console.error(`❌ P7: 发现 ${hits.length} 处 openchamber 自定义类 typography-*（本项目未定义）`)
  console.error('   一律替换为标准 Tailwind utility（text-sm / font-medium / text-base 等）。')
  console.error('')
  for (const h of hits) {
    console.error(`   [${h.workspace}] ${h.file}:${h.line}  [${h.match}]`)
    console.error(`     ${h.snippet}`)
  }
  process.exit(1)
}

console.log('✅ P7: 所有 workspace 包 src/ 下无 typography-* 残留')
