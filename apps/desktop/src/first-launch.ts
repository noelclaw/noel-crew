import { spawn } from "node:child_process";

import { app, dialog } from "electron";
import { doctorClaudeHooks, installClaudeHooks } from "@noelclawai/claude";

const DETECT_TIMEOUT_MS = 4_000;

function runDetect(cmd: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (v: boolean): void => { if (!settled) { settled = true; resolve(v); } };
    try {
      const child = spawn(cmd, args, { stdio: "ignore", shell: false });
      const timer = setTimeout(() => { child.kill(); settle(false); }, DETECT_TIMEOUT_MS);
      child.on("close", (code) => { clearTimeout(timer); settle(code === 0); });
      child.on("error", () => { clearTimeout(timer); settle(false); });
    } catch {
      settle(false);
    }
  });
}

export async function promptAndInstallHooksOnFirstLaunch(): Promise<void> {
  const commandMode = app.isPackaged ? "bundled" : "published";

  // Skip silently if hooks are already installed
  try {
    const doctor = doctorClaudeHooks(undefined, commandMode);
    if (doctor.status === "installed") return;
  } catch {
    // May throw before packaging when asserting bundled paths — continue
  }

  // Detect Claude Code on PATH before prompting
  const claudeCmd = process.platform === "win32" ? "claude.cmd" : "claude";
  const claudeFound = await runDetect(claudeCmd, ["--version"]);
  if (!claudeFound) return;

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
    installClaudeHooks(undefined, commandMode);
    await dialog.showMessageBox({
      type: "info",
      title: "NoelCrew",
      message: "Claude Code hooks configured!",
      detail: "NoelCrew will now react to your Claude Code sessions. Manage hooks anytime in Integrations.",
      buttons: ["OK"],
    });
  } catch (error) {
    await dialog.showMessageBox({
      type: "warning",
      title: "NoelCrew",
      message: "Hook configuration failed",
      detail: `Could not configure Claude Code hooks: ${error instanceof Error ? error.message : String(error)}\n\nYou can try again from Integrations.`,
      buttons: ["OK"],
    });
  }
}
