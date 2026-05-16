import { dialog } from "electron";

import { getAgentSetupSnapshot, runAgentSetupAction } from "./agent-setup.js";

export async function promptAndInstallHooksOnFirstLaunch(): Promise<void> {
  let snapshot;
  try {
    snapshot = await getAgentSetupSnapshot();
  } catch {
    return;
  }

  // Skip if hooks are already installed or Claude Code is not detected
  if (snapshot.hookStatus.status === "installed") return;
  if (snapshot.status.state === "not_detected") return;

  const { response } = await dialog.showMessageBox({
    type: "question",
    title: "Configure Claude Code Hooks",
    message: "Claude Code detected",
    detail: "Would you like NoelCrew to configure hooks for Claude Code?\n\nThis lets your pet react to coding events (prompts, tool use, completions) in real time.\n\nYou can change this anytime in Integrations.",
    buttons: ["Yes, configure hooks", "Skip"],
    defaultId: 0,
    cancelId: 1,
  });

  if (response !== 0) return;

  try {
    const result = await runAgentSetupAction("install-hooks");
    const action = result.lastAction;
    if (action?.ok) {
      await dialog.showMessageBox({
        type: "info",
        title: "NoelCrew",
        message: "Claude Code hooks configured!",
        detail: "NoelCrew will now react to your Claude Code sessions. Manage hooks anytime in Integrations.",
        buttons: ["OK"],
      });
    } else {
      await dialog.showMessageBox({
        type: "warning",
        title: "NoelCrew",
        message: "Hook configuration failed",
        detail: `${action?.message ?? "Unknown error"}\n\nYou can try again from Integrations.`,
        buttons: ["OK"],
      });
    }
  } catch (error) {
    await dialog.showMessageBox({
      type: "warning",
      title: "NoelCrew",
      message: "Hook configuration failed",
      detail: `${error instanceof Error ? error.message : String(error)}\n\nYou can try again from Integrations.`,
      buttons: ["OK"],
    });
  }
}
