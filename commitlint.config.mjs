/**
 * Commitlint 配置 — Conventional Commits
 * 文档: https://commitlint.js.org/reference/rules.html
 *
 * 允许的 type（与历史 commit 一致）：
 *   feat / fix / docs / style / refactor / perf / test / build / ci / chore / revert
 *
 * subject 大小写不限制（中英混合 commit message 常见）
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 与历史 commit 风格一致；允许中英混合
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0],
    // header 默认 100 字符（config-conventional 默认），保持
    'header-max-length': [2, 'always', 100],
    // type 必须在白名单内
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    // 允许 scope 包含 / (e.g. "feat(components/ui): ...")
    'scope-enum': [0],
  },
}
