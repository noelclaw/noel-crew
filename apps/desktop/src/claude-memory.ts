import { chmodSync, closeSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

export interface ClaudeNoelCrewMemoryResult {
  readonly changed: boolean;
  readonly claudeMdPath: string;
  readonly noelCrewMemoryPath: string;
}

export interface ClaudeNoelCrewMemoryStatus {
  readonly status: "installed" | "not_installed" | "error";
  readonly message: string;
  readonly claudeMdPath: string;
  readonly noelCrewMemoryPath: string;
}

export const noelCrewClaudeImportLine = "@~/.claude/noelcrew.md";

const noelCrewImportStart = "<!-- NOELCREW:IMPORT:START -->";
const noelCrewImportEnd = "<!-- NOELCREW:IMPORT:END -->";
const noelCrewMemoryStart = "<!-- NOELCREW:START -->";
const noelCrewMemoryEnd = "<!-- NOELCREW:END -->";
const maxClaudeMemoryBytes = 1024 * 1024;

export function installClaudeNoelCrewMemory(homeDir: string): ClaudeNoelCrewMemoryResult {
  const paths = getClaudeMemoryPaths(homeDir);
  assertSafeClaudeMemoryPaths(paths.claudeDir, paths.claudeMdPath, paths.noelCrewMemoryPath);
  mkdirSync(paths.claudeDir, { recursive: true, mode: 0o700 });
  assertSafeClaudeMemoryPaths(paths.claudeDir, paths.claudeMdPath, paths.noelCrewMemoryPath);

  const currentNoelCrewMemory = readTextFile(paths.noelCrewMemoryPath);
  const nextNoelCrewMemory = upsertNoelCrewMemoryBlock(currentNoelCrewMemory, createNoelCrewMemoryBlock());
  const noelCrewChanged = currentNoelCrewMemory !== nextNoelCrewMemory;
  if (noelCrewChanged) writePrivateTextFile(paths.noelCrewMemoryPath, nextNoelCrewMemory);

  const currentClaudeMd = readTextFile(paths.claudeMdPath);
  const nextClaudeMd = ensureManagedImport(currentClaudeMd);
  const claudeMdChanged = currentClaudeMd !== nextClaudeMd;
  if (claudeMdChanged) writePrivateTextFile(paths.claudeMdPath, nextClaudeMd);

  return { changed: noelCrewChanged || claudeMdChanged, claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
}

export function uninstallClaudeNoelCrewMemory(homeDir: string): ClaudeNoelCrewMemoryResult {
  const paths = getClaudeMemoryPaths(homeDir);
  assertSafeClaudeMemoryPaths(paths.claudeDir, paths.claudeMdPath, paths.noelCrewMemoryPath);

  let changed = false;
  const currentClaudeMd = readTextFile(paths.claudeMdPath);
  const hasUserOwnedImport = hasImportLineOutsideManagedBlock(currentClaudeMd);
  const nextClaudeMd = removeManagedImport(currentClaudeMd);
  if (currentClaudeMd !== nextClaudeMd) {
    writePrivateTextFile(paths.claudeMdPath, nextClaudeMd);
    changed = true;
  }

  const currentNoelCrewMemory = readTextFile(paths.noelCrewMemoryPath);
  if (currentNoelCrewMemory) {
    const nextNoelCrewMemory = removeNoelCrewMemoryBlock(currentNoelCrewMemory);
    if (nextNoelCrewMemory.trim().length === 0) {
      if (hasUserOwnedImport) {
        writePrivateTextFile(paths.noelCrewMemoryPath, "");
      } else {
        rmSync(paths.noelCrewMemoryPath, { force: true });
      }
      changed = true;
    } else if (nextNoelCrewMemory !== currentNoelCrewMemory) {
      writePrivateTextFile(paths.noelCrewMemoryPath, nextNoelCrewMemory);
      changed = true;
    }
  }

  return { changed, claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
}

export function doctorClaudeNoelCrewMemory(homeDir: string): ClaudeNoelCrewMemoryStatus {
  const paths = getClaudeMemoryPaths(homeDir);
  try {
    assertSafeClaudeMemoryPaths(paths.claudeDir, paths.claudeMdPath, paths.noelCrewMemoryPath);
    const claudeMd = readTextFile(paths.claudeMdPath);
    const noelCrewMemory = readTextFile(paths.noelCrewMemoryPath);
    const hasImport = hasManagedImport(claudeMd) || hasImportLineOutsideManagedBlock(claudeMd);
    const hasInstructions = createNoelCrewBlockPattern().test(noelCrewMemory) || /noelcrew_say|NoelCrew MCP/i.test(noelCrewMemory);
    if (hasImport && hasInstructions) {
      return { status: "installed", message: "Claude will load NoelCrew instructions from ~/.claude/noelcrew.md.", claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
    }
    if (hasImport) {
      return { status: "not_installed", message: "Claude imports NoelCrew instructions, but the NoelCrew memory file is missing or incomplete.", claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
    }
    if (hasInstructions) {
      return { status: "not_installed", message: "NoelCrew instructions exist, but Claude is not importing them yet.", claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
    }
    return { status: "not_installed", message: "Claude NoelCrew instructions are not installed.", claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Claude NoelCrew instruction status is unavailable.", claudeMdPath: paths.claudeMdPath, noelCrewMemoryPath: paths.noelCrewMemoryPath };
  }
}

export function getClaudeMemoryPaths(homeDir: string): { readonly claudeDir: string; readonly claudeMdPath: string; readonly noelCrewMemoryPath: string } {
  const claudeDir = join(homeDir, ".claude");
  return {
    claudeDir,
    claudeMdPath: join(claudeDir, "CLAUDE.md"),
    noelCrewMemoryPath: join(claudeDir, "noelcrew.md"),
  };
}

export function createNoelCrewMemoryBlock(): string {
  return `${noelCrewMemoryStart}\n## NoelCrew\n\nNoelCrew MCP tools may be available.\n\nUse NoelCrew as a short visible status channel for meaningful coding progress:\n- Use \`noelcrew_say\` when starting, completing, blocking, or needing review on non-trivial work.\n- Keep messages brief, user-facing, and non-sensitive.\n- Do not include code, logs, secrets, URLs, or file paths.\n- Use \`noelcrew_react\` for small visual or emotional feedback.\n- Use \`noelcrew_status\` only when checking availability or the targeted pet.\n- Do not spam every internal step.\n${noelCrewMemoryEnd}\n`;
}

export function ensureImportLine(source: string, importLine: string): string {
  const lines = source.split(/\r?\n/);
  const filtered = lines.filter((line) => line.trim() !== importLine);
  const base = filtered.join("\n").replace(/\s*$/u, "");
  return base ? `${base}\n\n${importLine}\n` : `${importLine}\n`;
}

export function ensureManagedImport(source: string): string {
  const withoutManagedImports = removeManagedImport(source).replace(/\s*$/u, "");
  if (withoutManagedImports.split(/\r?\n/).some((line) => line.trim() === noelCrewClaudeImportLine)) {
    return withoutManagedImports ? `${withoutManagedImports}\n` : "";
  }
  const block = `${noelCrewImportStart}\n${noelCrewClaudeImportLine}\n${noelCrewImportEnd}`;
  return withoutManagedImports ? `${withoutManagedImports}\n\n${block}\n` : `${block}\n`;
}

export function removeManagedImport(source: string): string {
  return source.replace(createManagedImportPattern(), "").replace(/\n{3,}/g, "\n\n").replace(/\s*$/u, (match) => (match.includes("\n") ? "\n" : ""));
}

export function removeImportLine(source: string, importLine: string): string {
  return source
    .split(/\r?\n/)
    .filter((line) => line.trim() !== importLine)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s*$/u, (match) => (match.includes("\n") ? "\n" : ""));
}

export function upsertNoelCrewMemoryBlock(source: string, block: string): string {
  const withoutBlocks = source.replace(createNoelCrewBlockPattern(), "").replace(/\n{3,}/g, "\n\n").replace(/\s*$/u, "");
  return withoutBlocks ? `${withoutBlocks}\n\n${block}` : block;
}

export function removeNoelCrewMemoryBlock(source: string): string {
  const withoutBlock = source.replace(createNoelCrewBlockPattern(), "").replace(/\n{3,}/g, "\n\n").trim();
  return withoutBlock ? `${withoutBlock}\n` : "";
}

function createNoelCrewBlockPattern(): RegExp {
  return new RegExp(`${escapeRegExp(noelCrewMemoryStart)}[\\s\\S]*?${escapeRegExp(noelCrewMemoryEnd)}\\n?`, "g");
}

function createManagedImportPattern(): RegExp {
  return new RegExp(`${escapeRegExp(noelCrewImportStart)}[\\s\\S]*?${escapeRegExp(noelCrewImportEnd)}\\n?`, "g");
}

function hasManagedImport(source: string): boolean {
  return createManagedImportPattern().test(source);
}

function hasImportLineOutsideManagedBlock(source: string): boolean {
  return removeManagedImport(source).split(/\r?\n/).some((line) => line.trim() === noelCrewClaudeImportLine);
}

function assertSafeClaudeMemoryPaths(claudeDir: string, claudeMdPath: string, noelCrewMemoryPath: string): void {
  if (existsSync(claudeDir)) {
    const stat = lstatSync(claudeDir);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error("Claude memory directory is not a safe directory.");
  }
  for (const path of [claudeMdPath, noelCrewMemoryPath]) {
    if (!existsSync(path)) continue;
    const stat = lstatSync(path);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("Claude memory file is not a safe regular file.");
    if (stat.size > maxClaudeMemoryBytes) throw new Error("Claude memory file is too large for NoelCrew to update safely.");
  }
}

function readTextFile(path: string): string {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function writePrivateTextFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  assertSafeWriteTarget(path);
  const tempPath = join(dirname(path), `.${process.pid}.${randomUUID()}.tmp`);
  const fd = openSync(tempPath, "wx", 0o600);
  try {
    writeFileSync(fd, content, { encoding: "utf8" });
  } finally {
    closeSync(fd);
  }
  assertSafeWriteTarget(path);
  renameSync(tempPath, path);
  try { chmodSync(path, 0o600); } catch { /* best effort */ }
}

function assertSafeWriteTarget(path: string): void {
  if (!existsSync(path)) return;
  const stat = lstatSync(path);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("Claude memory file is not a safe regular file.");
  if (stat.size > maxClaudeMemoryBytes) throw new Error("Claude memory file is too large for NoelCrew to update safely.");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
