# Worked Example — verify a biz-components storybook story

End-to-end pattern: open storybook → screenshot → vision subagent → parse verdict → branch on FAIL.

This example verifies the `SidebarLayout` story in `biz-components` after a hypothetical style change.

## 1. Start the Storybook dev server (if not running)

```bash
cd biz-components && pnpm storybook
```

Dev server runs on `http://localhost:6007`. Wait for the "Storybook ready" banner before proceeding.

## 2. Open the story and capture a screenshot

`xd://browser` open + run pattern:

```json
// write to xd://browser
{ "action": "open", "name": "biz", "url": "http://localhost:6007/iframe.html?id=biz-settings-shared--sidebar-layout&viewMode=story", "viewport": { "width": 1280, "height": 800 } }
```

```json
// write to xd://browser
{ "action": "run", "name": "biz", "code": "await tab.goto('http://localhost:6007/iframe.html?id=biz-settings-shared--sidebar-layout&viewMode=story', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 4000)); const shot = await tab.screenshot({ format: 'png' }); return shot;" }
```

The run returns an object with `dest` — that absolute path is the screenshot file.

## 3. Spawn the vision subagent

In an `eval` cell (JS):

```js
const screenshotPath = "<paste dest from step 2>";

const h = await agent(
  `You are a vision verification subagent. Look at the screenshot at this path:

${screenshotPath}

Expected contract (this is a PluginsSidebar-style settings sidebar):

- Outer aside, width 280px, border-r, muted background
- Header slot: <h2>Plugins</h2> + "Total N" count + refresh icon button + add icon button
- Group labels (plain text, uppercase, muted): "USER CONFIG", "USER PLUGIN FILE"
- Under each label: 1 SettingsSidebarItem with icon + name + metadata + per-item dropdown trigger
- Right panel: empty state with plug icon + "Select a plugin to view or edit" + "Or click + to add a new plugin"

Reply with this JSON shape:

{
  "left_panel":     "<observed left sidebar contents>",
  "right_panel":    "<observed right panel contents>",
  "header":         "<observed header>",
  "visual_issues":  ["<concrete issue or empty array>"],
  "verdict":        "PASS" | "FAIL",
  "summary":        "<one-sentence assessment>"
}

Flag any deviation from the expected contract as a visual_issue.`,
  { agent: "task", handle: true, model: "minimax-m3" }
);

const report = JSON.parse(h.output);
return report;
```

## 4. Branch on verdict

```js
if (report.verdict === "PASS") {
  // proceed: commit / move to next task
} else {
  // inspect report.visual_issues, edit the component, re-run from step 2
}
```

## 5. Clean up

```json
// write to xd://browser
{ "action": "close", "all": true }
```

```bash
# stop storybook dev server
```

## Realistic output sample

When the SidebarLayout story renders correctly, `minimax-m3` returns something like:

```json
{
  "left_panel": "aside 280px wide, Plugins h2, Total 2, refresh + add buttons, USER CONFIG group with oh-my-openagent (npm package), USER PLUGIN FILE group with opencode-loop.js (Plugin file)",
  "right_panel": "Empty state: plug icon, 'Select a plugin to view or edit', 'Or click + to add a new plugin'",
  "header": "Plugins + Total 2 + refresh + add icon buttons",
  "visual_issues": [],
  "verdict": "PASS",
  "summary": "Coherent settings sidebar layout matching PluginsSidebar contract; no visual defects."
}
```

If something is broken (e.g. refresh icon missing, group label misaligned), the same prompt surfaces it as a `visual_issues` entry and `verdict` flips to `FAIL`.
