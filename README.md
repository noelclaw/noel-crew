# Noel Crew

**A tray-first desktop companion for AI coding agents.**

A small pixel crew lives on your desktop and reacts in real-time while your agents think, edit files, run tests, execute workflows, wait for approval, finish tasks, or hit errors.

Local-first. No cloud. No telemetry.

---

## Install

Download the latest installer from [github.com/noelclaw/noel-crew/releases](https://github.com/noelclaw/noel-crew/releases):

| Platform | File |
| --- | --- |
| Windows | `NoelCrew-*-win-x64-setup.exe` |
| macOS (Apple Silicon) | `NoelCrew-*-mac-arm64.dmg` |
| macOS (Intel) | `NoelCrew-*-mac-x64.dmg` |
| Linux | `NoelCrew-*-linux-x86_64.AppImage` |

Launch Noel Crew. The desktop pet and tray icon will appear.

> Builds are currently unsigned. macOS or Windows may show a security warning on first launch.

If macOS says the app is damaged:

```bash
xattr -dr com.apple.quarantine /Applications/Noel\ Crew.app
open /Applications/Noel\ Crew.app
```

---

## Connect to Noelclaw

```bash
claude mcp add noelclaw -- npx @noelclaw/research
```

Or connect any MCP-capable agent:

```json
{
  "mcpServers": {
    "noelcrew": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@noelclaw/mcp"]
    }
  }
}
```

---

## MCP tools

| Tool | Description |
| --- | --- |
| `noelcrew_status` | Check if Noel Crew is running and which pet is targeted |
| `noelcrew_react` | Set a reaction on the desktop pet |
| `noelcrew_say` | Show a short safe message bubble |
| `noel_signal_fired` | Signal fired → excited (celebrating) animation |
| `noel_whale_alert` | Whale alert → alert (waiting) animation |
| `noel_research_start` | Research begins → working animation |
| `noel_research_complete` | Research done → success animation |
| `noel_swap_executing` | Swap in progress → running animation |
| `noel_error` | Error condition → error animation |

---

## Agent reactions

| Agent activity | Animation |
| --- | --- |
| Thinking / chat start | `thinking` |
| Editing files | `editing` |
| Running tests | `testing` |
| Waiting for approval | `waiting` |
| Task complete | `success` |
| Error / session stop | `error` |
| Signal fired | `celebrating` |
| Research running | `working` |
| Swap executing | `running` |

---

## Workspace

```
apps/desktop        Electron desktop app
packages/client     @noelclaw/client — local IPC client
packages/mcp        @noelclaw/mcp — MCP stdio server
packages/claude     @noelclaw/claude — Claude hook helpers
packages/opencode   @noelclaw/opencode — OpenCode plugin
packages/cli        @noelclaw/cli — CLI entrypoints
packages/pi         @noelclaw/pi — Pi extension
```

---

## Development

```bash
pnpm install
pnpm build
pnpm dev:desktop
```

---

[noelclaw.fun](https://noelclaw.fun) · [github.com/noelclaw/noel-crew](https://github.com/noelclaw/noel-crew)
