---
name: vision-check
description: Delegate visual verification to a multimodal subagent when the main agent cannot see images (e.g. text-only model). Spawn the project-defined `vision` agent to inspect a screenshot and return structured findings (left/right panel contents, visual issues, pass/fail verdict). Use this whenever a UI change needs visual confirmation — after Storybook edits, browser smoke tests, before commits with UI impact, or when a user reports a visual bug.
---

# Vision Check — delegate visual verification to the `vision` subagent

## When to use

Invoke this skill when the main agent needs visual confirmation of a UI state but cannot see images itself. Typical triggers:

- After editing a Storybook story or component styling — verify the rendered output
- Before a commit that touches `.tsx` / `.css` / storybook files — visual smoke gate
- When a user reports "the layout looks off" / "this is broken" — capture and inspect
- After any change that could affect alignment, spacing, color tokens, or overflow

**Do NOT use** for:

- Pure logic / type / config changes with no visual surface (overkill; each call costs ~10-30 s)
- Pure-text content reviews (use `tab.evaluate` to read `innerText` instead)
- Iterations inside a tight code-edit loop (capture once at the end, not every step)

## The `vision` subagent

Defined in [`.omp/agents/vision.md`](../../.omp/agents/vision.md). It bundles:

- **Model**: `minimax-m3` (hardcoded; caller does not pass `model`)
- **Tools**: `read`, `eval` (read-only)
- **System prompt**: inspection checklist (layout / alignment / color / typography / dead space / empty states)
- **Output schema**: structured JSON with `left_panel`, `right_panel`, `header`, `visual_issues`, `verdict`, `summary`

You don't write any of this when calling — just hand it a screenshot path and (optionally) a contract.

## Capture pattern

1. Open the target page with `xd://browser` (`tab.goto(...)`)
2. Wait for content to settle (`await new Promise(r => setTimeout(r, 3000))`)
3. Screenshot to local file via `tab.screenshot({ format: "png" })`
   - `tab.screenshot` always stores as webp regardless of `format`; both are acceptable to the `vision` agent
   - The returned object has `dest` (absolute path) — that's what you pass to the subagent

## Invocation template (JS, run inside an `eval` cell)

Minimal — just hand over the screenshot path:

```js
const screenshotPath = "<absolute path from tab.screenshot().dest>";

const h = await agent(
  `Inspect the screenshot at this path:

${screenshotPath}`,
  { agent: "vision", handle: true }
);

return h;  // h.output is the JSON string; JSON.parse it
```

With an explicit contract (recommended when you have specific expectations):

```js
const h = await agent(
  `Inspect the screenshot at this path:

${screenshotPath}

Expected contract:
- aside 280px wide, border-r, muted background
- Header: <h2>Plugins</h2> + "Total N" count + refresh icon button + add icon button
- Group labels "USER CONFIG" / "USER PLUGIN FILE" (plain text, uppercase)
- 1 item per group with icon + name + metadata + per-item dropdown trigger
- Right panel: empty state with plug icon + "Select a plugin to view or edit"`,
  { agent: "vision", handle: true }
);

const report = JSON.parse(h.output);
return report;
```

## Branching on verdict

```js
const report = JSON.parse(h.output);
if (report.verdict === "PASS") {
  // proceed: commit / move to next task
} else {
  // each report.visual_issues[i] is a concrete defect — address in code, re-capture, re-check
}
```

## Fallback model

If `minimax-m3` is down or the gateway rejects the request, override the model at call time:

```js
const h = await agent(prompt, { agent: "vision", handle: true, model: "mimo-v2.5" });
```

`mimo-v2.5` is the secondary confirmed-working multimodal model in this project's axonhub config.

## Failure modes and recovery

| Symptom | Likely cause | Fix |
|---|---|---|
| `400 Upstream request failed` | axonhub can't route model in openai format | Override with `model: "mimo-v2.5"` |
| `422 model not found` | Wrong model id (must be bare id, not `provider/id`) | Already handled by agent definition; only fails if you override incorrectly |
| `Unknown agent "vision"` | omp hasn't loaded `.omp/agents/vision.md` yet | Restart omp session; or check `.omp/agents/vision.md` exists with valid frontmatter |
| Subagent returns text but no image analysis | `read` tool wasn't called or image decode failed | Verify `tab.screenshot` returned a non-empty `dest` and the file exists |
| JSON parse fails on `h.output` | Model returned prose instead of JSON | Re-run; the agent's output schema should enforce JSON |

## Cost / latency budget

- Each invocation: ~10-30 s wall time (subagent spawn + image read + model inference)
- Token cost: ~1-2k input tokens (image) + ~200-500 output tokens per check
- Recommended cap: **at most 3 vision checks per UI change cycle** (initial verify + fix verify + final verify). More than that means you're flailing — switch to manual DOM inspection via `tab.evaluate`.

## Project-specific usage in omp-web

This project has two Storybook instances:

- `components/` → port `6006` (atomic primitives)
- `biz-components` → port `6007` (business composites)

To verify a `biz-components` story:

```bash
cd biz-components && pnpm storybook &  # dev server on :6007
```

```js
// eval cell
await open({ name: "biz", url: "http://localhost:6007/iframe.html?id=<story-id>&viewMode=story" });
await new Promise(r => setTimeout(r, 3000));
const shot = await run({ name: "biz", code: "return await tab.screenshot({format:'png'});" });
// shot.dest is the local path → pass to vision subagent per template above
```

Story IDs are lowercase-kebab of `<category>--<story-name>` (e.g. `biz-settings-shared--sidebar-layout`). When unsure, read `biz-components/storybook-static/index.json` for the full list.

## Related files

- [`skill://vision-check/examples/storybook-check.md`](skill://vision-check/examples/storybook-check.md) — full worked example
- [`.omp/agents/vision.md`](../../.omp/agents/vision.md) — subagent definition (model + system prompt + output schema)
- `~/.omp/agent/models.yml` — multimodal model list (look for `input: [text, image]`)
