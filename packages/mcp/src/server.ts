import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { handleReact, handleSay, handleStatus, reactSchema, saySchema, type ToolContext } from "./tools.js";

export function createNoelCrewMcpServer(context: ToolContext): McpServer {
  const server = new McpServer({ name: "noel-crew", version: "0.0.0" }, {
    instructions: "Interact with the user's NoelCrew desktop companion. Use noelcrew_status first. Use noelcrew_say only for short status/personality messages, never code, logs, secrets, URLs, or file paths.",
  });

  server.registerTool("noelcrew_status", {
    title: "NoelCrew Status",
    description: "Check whether NoelCrew is reachable and which pet MCP events currently target.",
    inputSchema: {},
    annotations: { readOnlyHint: true, idempotentHint: true },
  }, async () => handleStatus(context));

  server.registerTool("noelcrew_react", {
    title: "NoelCrew React",
    description: "Set a short coding-oriented reaction on the NoelCrew desktop pet.",
    inputSchema: reactSchema,
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async (input) => handleReact(input, context));

  server.registerTool("noelcrew_say", {
    title: "NoelCrew Say",
    description: "Show a short safe message on the NoelCrew desktop pet. Do not send code, logs, secrets, URLs, or file paths.",
    inputSchema: saySchema,
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async (input) => handleSay(input, context));

  return server;
}
