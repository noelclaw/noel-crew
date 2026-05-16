#!/usr/bin/env node
import { runClaudeHookFromStdin } from "./hooks.js";
import { doctorClaudeHooks, installClaudeHooks, uninstallClaudeHooks } from "./hook-settings.js";
import { validateNoelCrewPetArg } from "./claude-code.js";

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (command === "hook") {
    const code = await runClaudeHookFromStdin(process.stdin, { configuredPetId: readPetArg(args), projectLocal: hasProjectLocalArg(args), debug: process.env.NOELCREW_DEBUG === "1" });
    process.exitCode = code;
    return;
  }
  if (command === "doctor-hooks") {
    process.stderr.write(`${JSON.stringify(doctorClaudeHooks(readPathArg(args), undefined, readPetArg(args)), null, 2)}\n`);
    return;
  }
  if (command === "install-hooks") {
    process.stderr.write(`${JSON.stringify(installClaudeHooks(readPathArg(args), undefined, readPetArg(args)), null, 2)}\n`);
    return;
  }
  if (command === "uninstall-hooks") {
    process.stderr.write(`${JSON.stringify(uninstallClaudeHooks(readPathArg(args)), null, 2)}\n`);
    return;
  }
  process.stderr.write("Usage: noel-crew-claude <hook|doctor-hooks|install-hooks|uninstall-hooks> [--settings <path>] [--pet <id>]\n");
  process.exitCode = 1;
}

function readPathArg(args: readonly string[]): string | undefined {
  const index = args.indexOf("--settings");
  const value = index >= 0 ? args[index + 1] : undefined;
  return value && value.length > 0 ? value : undefined;
}

function readPetArg(args: readonly string[]): string | undefined {
  const equals = args.find((arg) => arg.startsWith("--pet="));
  if (equals) return validateNoelCrewPetArg(equals.slice("--pet=".length));
  const index = args.indexOf("--pet");
  const value = index >= 0 ? args[index + 1] : undefined;
  if (index >= 0 && (!value || value.startsWith("--"))) throw new Error("Missing value for --pet.");
  return value && value.length > 0 ? validateNoelCrewPetArg(value) : undefined;
}

function hasProjectLocalArg(args: readonly string[]): boolean {
  return args.includes("--project-local");
}

main().catch((error: unknown) => {
  process.stderr.write(`NoelCrew Claude CLI failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
