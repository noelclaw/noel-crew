# packages/

Monorepo workspace containing all NoelCrew npm packages. Each package is independently publishable with its own versioning.

## Responsibility

Provides modular, reusable components for the NoelCrew ecosystem:
- **pet-format**: Package marker interface for type identification
- **agent-events**: Speech pools and validation for agent feedback messages
- **client**: Core IPC client for communicating with NoelCrew desktop app
- **cli**: Main CLI tool for configuring agents and managing pets
- **mcp**: MCP server implementation for agent integration
- **opencode**: OpenCode editor integration (plugin, config management)
- **pi**: Pi coding-agent extension integration (event reactions, slash commands)
- **claude**: Claude Code integration (hooks, MCP config)
- **install-pet**: Standalone pet installer from gallery catalog

## Design

**Workspace Pattern**: Uses pnpm workspaces with `workspace:*` dependencies for internal linking.

**Package Structure**: Each package follows consistent structure:
- `src/` - TypeScript source
- `dist/` - Compiled output (not committed)
- `package.json` - Standard npm metadata with exports map
- Contract check files (`check-*.ts`) for runtime validation

**ESM-First**: All packages are ESM (`"type": "module"`) with dual exports for types.

**Versioning**: Independent versioning per package (all currently 2.0.x).

## Flow

```
CLI Entry (packages/cli/src/index.ts)
    ├── Configures Claude → @noelclaw/claude
    ├── Configures OpenCode → @noelclaw/opencode
    ├── Spawns MCP server → @noelclaw/mcp
    └── Uses IPC client → @noelclaw/client

MCP Server (packages/mcp/src/index.ts)
    ├── Registers tools (status, react, say)
    └── Communicates via @noelclaw/client

OpenCode Plugin (packages/opencode/src/plugin.ts)
    └── Hooks into editor events → @noelclaw/client

Pi Extension (packages/pi/src/extension.ts)
    └── Hooks into Pi extension events → @noelclaw/client

Claude Hooks (packages/claude/src/hooks.ts)
    └── Processes hook events → @noelclaw/client
```

## Integration Points

**Inter-Package Dependencies**:
- `cli` depends on: `client`, `claude`, `mcp`, `opencode`
- `mcp` depends on: `client`
- `claude` depends on: `client`, `agent-events`
- `opencode` depends on: `client`, `agent-events`
- `pi` depends on: `client`, `agent-events`
- `install-pet` depends on: `client`

**External Integrations**:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `jsonc-parser` - JSON with comments parsing for OpenCode configs
- `yauzl` - ZIP extraction for pet downloads
- `zod` - Schema validation in MCP tools

**Desktop App Communication**:
All packages ultimately communicate with the NoelCrew desktop app via the IPC protocol defined in `client/src/protocol.ts`.
