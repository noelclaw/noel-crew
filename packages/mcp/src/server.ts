import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { handleEventReact, handleReact, handleSay, handleStatus, reactSchema, saySchema, type ToolContext } from "./tools.js";

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


  server.registerTool("noel_signal_fired", {
    title: "Noel Signal Fired",
    description: "Triggered when a Noel signal fires. Plays the excited (celebrating) animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("celebrating", context));

  server.registerTool("noel_whale_alert", {
    title: "Noel Whale Alert",
    description: "Triggered on a whale alert. Plays the alert (waiting) animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("waiting", context));

  server.registerTool("noel_research_start", {
    title: "Noel Research Start",
    description: "Triggered when research begins. Plays the working animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("working", context));

  server.registerTool("noel_research_complete", {
    title: "Noel Research Complete",
    description: "Triggered when research completes. Plays the success animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("success", context));

  server.registerTool("noel_swap_executing", {
    title: "Noel Swap Executing",
    description: "Triggered during a swap execution. Plays the running animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("running", context));

  server.registerTool("noel_error", {
    title: "Noel Error",
    description: "Triggered on an error condition. Plays the error animation on the desktop pet.",
    inputSchema: {},
    annotations: { readOnlyHint: false, idempotentHint: false },
  }, async () => handleEventReact("error", context));

  return server;
}
