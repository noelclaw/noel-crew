import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

import { createNoelCrewClient, getDiscoveryFilePath } from "@noelclawai/client";

const LAUNCH_WAIT_MS = 7_000;
const POLL_INTERVAL_MS = 600;

function findInstalledApp(): string | null {
  if (process.platform === "win32") {
    const localData = process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local");
    const progFiles = process.env.PROGRAMFILES ?? "C:\\Program Files";
    for (const p of [
      join(localData, "Programs", "noel-crew", "Noel Crew.exe"),
      join(localData, "Programs", "NoelCrew", "Noel Crew.exe"),
      join(progFiles, "Noel Crew", "Noel Crew.exe"),
    ]) {
      if (existsSync(p)) return p;
    }
    return null;
  }

  if (process.platform === "darwin") {
    for (const p of [
      "/Applications/Noel Crew.app",
      join(homedir(), "Applications", "Noel Crew.app"),
    ]) {
      if (existsSync(p)) return p;
    }
    return null;
  }

  // Linux
  for (const p of [
    join(homedir(), ".local", "bin", "noel-crew"),
    "/usr/bin/noel-crew",
    "/usr/local/bin/noel-crew",
  ]) {
    if (existsSync(p)) return p;
  }
  return null;
}

function spawnDetached(appPath: string): void {
  try {
    if (process.platform === "darwin") {
      spawn("open", ["-a", appPath], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn(appPath, [], { detached: true, stdio: "ignore", windowsHide: true }).unref();
    }
  } catch { /* ignore spawn errors */ }
}

const delay = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

export async function ensureDesktopRunning(): Promise<void> {
  // Short timeouts — this probe only determines whether to launch, not whether to fail
  const client = createNoelCrewClient({ connectTimeoutMs: 600, responseTimeoutMs: 600 });

  // If a discovery file exists, the app has run before on this machine — probe it
  if (existsSync(getDiscoveryFilePath())) {
    const status = await client.status();
    if (status.appRunning) return;
  }

  const appPath = findInstalledApp();
  if (!appPath) return;

  process.stderr.write("[NoelCrew] Auto-launching desktop app...\n");
  spawnDetached(appPath);

  const deadline = Date.now() + LAUNCH_WAIT_MS;
  while (Date.now() < deadline) {
    await delay(POLL_INTERVAL_MS);
    const s = await client.status();
    if (s.appRunning) {
      process.stderr.write("[NoelCrew] Desktop app ready.\n");
      return;
    }
  }
  // Timed out — MCP continues in degraded mode, existing error handling applies
}
