import { createNoelCrewOpenCodeHooks, type OpenCodePluginOptions } from "./opencode-plugin-runtime.js";

export const noelCrewOpenCodePluginId = "noel-crew-opencode";

const plugin = {
  id: noelCrewOpenCodePluginId,
  server: async (_input: unknown, options?: OpenCodePluginOptions) => createNoelCrewOpenCodeHooks(options ?? {}),
};

export default plugin;
