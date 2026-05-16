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

## Install Noel Crew MCP

Anyone can install Noel Crew as an MCP skill:

### Claude Code
```bash
claude mcp add noel-crew -- npx @noelclawai/crew
```

### Hermes
```bash
hermes mcp add noel-crew -- npx @noelclawai/crew
```

### OpenClaw
```bash
openclaw mcp add noel-crew -- npx @noelclawai/crew
```

### Cursor / Windsurf / Any MCP client
Add to your MCP config:
```json
{
  "mcpServers": {
    "noel-crew": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@noelclawai/crew"]
    }
  }
}
```

Full docs: https://docs.noelclaw.fun

---

## Auto-reactions for Claude Code

Add to `%APPDATA%\Claude\settings.json` (Windows) or `~/.claude/settings.json` (Mac/Linux):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": ".*",
        "hooks": [{"type": "command", "command": "node --input-type=module --eval \"import{createNoelCrewClient}from'file:///PATH_TO_NOELCREW/packages/client/dist/index.js';createNoelCrewClient().react('working').catch(()=>{})\""}]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{"type": "command", "command": "node --input-type=module --eval \"import{createNoelCrewClient}from'file:///PATH_TO_NOELCREW/packages/client/dist/index.js';createNoelCrewClient().react('editing').catch(()=>{})\""}]
      },
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "node --input-type=module --eval \"import{createNoelCrewClient}from'file:///PATH_TO_NOELCREW/packages/client/dist/index.js';createNoelCrewClient().react('running').catch(()=>{})\""}]
      }
    ],
    "Stop": [
      {
        "hooks": [{"type": "command", "command": "node --input-type=module --eval \"import{createNoelCrewClient}from'file:///PATH_TO_NOELCREW/packages/client/dist/index.js';createNoelCrewClient().react('celebrating').catch(()=>{})\""}]
      }
    ]
  }
}
```

Replace `PATH_TO_NOELCREW`:
- Windows: `C:/Users/YOUR_USERNAME/noelcrew`
- Mac/Linux: `/home/user/noelcrew`

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
packages/client     @noelclawai/client — local IPC client
packages/mcp        @noelclawai/crew   — MCP stdio server
packages/claude     @noelclawai/claude — Claude hook helpers
packages/opencode   @noelclawai/opencode — OpenCode plugin
packages/cli        @noelclawai/cli — CLI entrypoints
packages/pi         @noelclawai/pi — Pi extension
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
