#!/usr/bin/env node
/**
 * P9 + P10 invariant: 原子层 src/ui/ 禁止业务耦合
 *
 * 历史背景：迁移 openchamber 组件时，子 agent 容易把以下业务依赖带进来：
 *   - useI18n / useDeviceInfo / useUIStore（openchamber app 层 hook）
 *   - @openchamber/* / @opencode-ai/*（业务模块）
 *   - @/stores/* / @/sync/* / @/hooks/*（openchamber 内部业务路径）
 *   - @/lib/i18n / @/lib/desktop / @/lib/clipboard（业务 helper）
 *
 * 规则：原子层只放 shadcn 级原语，无 i18n（hardcode 英文），无业务 store/sync。
 * 业务对话框归 apps/<feature>/，不放 src/ui/。
 * 替换映射：useI18n → hardcode 英文；Icon → lucide-react；copyTextToClipboard → navigator.clipboard。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const scanRoot = resolve(root, 'components/src/ui')

// 禁止出现的 import 路径（子串匹配，正则）
const FORBIDDEN_IMPORT_PATTERNS = [
  { pattern: /from\s+['"]react-i18n['"]/, label: 'react-i18n（i18n 应在 app 层）' },
  { pattern: /from\s+['"]@openchamber\//, label: '@openchamber/*（业务模块）' },
  { pattern: /from\s+['"]@opencode-ai\//, label: '@opencode-ai/*（业务 SDK）' },
  { pattern: /from\s+['"]@\/stores\//, label: '@/stores/*（app 层状态）' },
  { pattern: /from\s+['"]@\/sync\//, label: '@/sync/*（app 层同步）' },
  { pattern: /from\s+['"]@\/hooks\//, label: '@/hooks/*（app 层 hook）' },
  { pattern: /from\s+['"]@\/lib\/i18n['"]/, label: '@/lib/i18n（业务 i18n）' },
  { pattern: /from\s+['"]@\/lib\/desktop['"]/, label: '@/lib/desktop（业务 desktop helper）' },
  { pattern: /from\s+['"]@\/lib\/clipboard['"]/, label: '@/lib/clipboard（用 navigator.clipboard 替代）' },
  { pattern: /from\s+['"]@\/components\/icon\/Icon['"]/, label: '@/components/icon/Icon（用 lucide-react 替代）' },
]

// 禁止出现的具名符号（任何形式的使用）
const FORBIDDEN_SYMBOLS = [
  { symbol: 'useI18n', label: 'useI18n（原子层无 i18n，hardcode 英文）' },
  { symbol: 'useDeviceInfo', label: 'useDeviceInfo（不要分支 desktop/mobile，取 desktop 默认）' },
  { symbol: 'useUIStore', label: 'useUIStore（app 层状态，不进原子层）' },
]

const EXTENSIONS = new Set(['.ts', '.tsx', '.jsx', '.js'])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) yield* walk(full)
    else if (EXTENSIONS.has(extOf(full))) yield full
  }
}

function extOf(p) {
  const i = p.lastIndexOf('.')
  return i === -1 ? '' : p.slice(i)
}

const hits = []

for (const file of walk(scanRoot)) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const { pattern, label } of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(line)) {
        hits.push({
          file: relative(root, file),
          line: i + 1,
          label,
          snippet: line.trim().slice(0, 140),
        })
      }
    }
    for (const { symbol, label } of FORBIDDEN_SYMBOLS) {
      // word-boundary match，避免误报子串
      const re = new RegExp(`\\b${symbol}\\b`)
      if (re.test(line)) {
        // 排除该符号在自己定义位置（虽然原子层根本不该有）
        if (line.includes(`function ${symbol}`) || line.includes(`const ${symbol} =`)) continue
        hits.push({
          file: relative(root, file),
          line: i + 1,
          label,
          snippet: line.trim().slice(0, 140),
        })
      }
    }
  }
}

if (hits.length > 0) {
  console.error(`❌ P9/P10: components/src/ui/ 发现 ${hits.length} 处业务耦合`)
  console.error('   原子层只放 shadcn 级原语，禁止 i18n / 业务 store / openchamber 内部模块。')
  console.error('')
  // 去重相邻
  const seen = new Set()
  for (const h of hits) {
    const key = `${h.file}:${h.line}:${h.label}`
    if (seen.has(key)) continue
    seen.add(key)
    console.error(`   ${h.file}:${h.line}  ${h.label}`)
    console.error(`     ${h.snippet}`)
  }
  process.exit(1)
}

console.log('✅ P9/P10: components/src/ui/ 原子层纯净（无 i18n / 业务耦合）')
