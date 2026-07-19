# Oh My Pi UI — Agent Guide

## Purpose

本项目为 Oh My Pi Agent 提供一个好看、易用的可视化界面，整体设计参考自 [OpenChamber](https://github.com/openchamber/openchamber)。

This file contains the always-on repository rules for any AI agent working in this repo. Detailed workflows belong to module documentation as the project grows.

## Instruction Order

Before editing:

1. Follow this root guide.
2. Read the nearest `README.md` / module docs when present.
3. Follow local code and test precedent.

If these sources materially conflict, stop and resolve the conflict instead of silently choosing one.

## Repository

- Remote: `git@github.com:Reamd7/omp-ui.git`
- Default branch: `main`
- Reference implementation: `C:\Users\reamd\Documents\experiment_area\backup\openchamber`

## Git & GitHub Workflow（强制）

> 这一节是硬性约束，违反即视为未完成任务。

### 必须使用 `gh` 提交代码

- 所有涉及 GitHub 的远端操作（推送分支、创建 PR、Release、查看 Issue/CI 等）**必须通过 [GitHub CLI (`gh`)](https://cli.github.com/)** 完成，不得直接使用 `git push` / `git remote` 之类的裸 git 命令与远端交互。
  - 推送分支：`gh repo sync` 或先 `git push`（仅本地→远端管道允许）后再用 `gh` 创建 PR；优先使用 `gh` 工作流。
  - 创建 PR：`gh pr create`
  - 查看 CI / 合并：`gh pr checks`, `gh pr merge`
- 本地 git 操作（`git add`, `git commit`, `git switch`, `git rebase` 等）不受此约束限制。

### 必须签名提交（GPG Signed Commits）

- **每一次 `git commit` 都必须带 GPG 签名**，未签名提交不允许推送到远端。
- 本仓库已开启 `commit.gpgsign = true`（提交者本机的 GPG key 自动签名）；具体的 key / 身份由作者本地 `.git/config` 维护，不在本文件中记录。
- 若签名失败（GPG agent 未启动、key 过期、passphrase 未缓存等），**立即停止并报告**，不要绕过签名「先提交再说」。
- 不要伪造或关闭签名校验；`--no-gpg-sign` 仅在用户明确要求时才能使用。

## Always-On Constraints

- 不要修改 `backup/openchamber` 参考目录；它只读。
- 除非用户明确要求，不要新增依赖。
- 不要把 secrets、token、密码、凭据写入代码或日志。
- 改动尽量小，保留工作区中无关的改动。
- 入口和桥接层保持轻薄，业务逻辑放进聚焦的模块里。
- 模块的所有权、契约或不变量发生变化时，同步更新对应文档。

## Correctness Invariants

- 优先使用权威状态，而非启发式推断。
- 不要让一次 fetch 失败伪装成「权威的空成功」。
- 部分结果、回滚、清理、陈旧数据的行为要显式表达。
- 单个实体失败不能抹除或阻塞其它独立的、完整的实体。

## Validation

- 以 `package.json` scripts 为命令的唯一权威来源（项目搭建后）。
- 优先跑聚焦的测试和包级 type-check / lint。
- 跨包契约、根工具、依赖或共享生成产物变更时，跑工作区级检查。
- 文档或配置类独立改动，只跑最窄的相关校验。
- 报告时如实说明「验证了什么」「没验证什么」；静态检查不能证明运行时 / 性能 / 平台正确性。
