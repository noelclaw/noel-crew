import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { ensureImportLine, ensureManagedImport, installClaudeNoelCrewMemory, noelCrewClaudeImportLine, removeImportLine, removeNoelCrewMemoryBlock, uninstallClaudeNoelCrewMemory, upsertNoelCrewMemoryBlock } from "./claude-memory.js";

assert.equal(ensureImportLine("", noelCrewClaudeImportLine), `${noelCrewClaudeImportLine}\n`);
assert.equal(ensureImportLine("# User notes\n", noelCrewClaudeImportLine), `# User notes\n\n${noelCrewClaudeImportLine}\n`);
assert.equal(ensureImportLine(`# User notes\n${noelCrewClaudeImportLine}\n${noelCrewClaudeImportLine}\n`, noelCrewClaudeImportLine), `# User notes\n\n${noelCrewClaudeImportLine}\n`);
assert.equal(removeImportLine(`# User notes\n\n${noelCrewClaudeImportLine}\n`, noelCrewClaudeImportLine), "# User notes\n");
assert.match(upsertNoelCrewMemoryBlock("custom\n", "<!-- NOELCREW:START -->\nmanaged\n<!-- NOELCREW:END -->\n"), /custom[\s\S]*managed/);
assert.equal((upsertNoelCrewMemoryBlock("<!-- NOELCREW:START -->\nold\n<!-- NOELCREW:END -->\n\n<!-- NOELCREW:START -->\nolder\n<!-- NOELCREW:END -->\n", "<!-- NOELCREW:START -->\nnew\n<!-- NOELCREW:END -->\n").match(/NOELCREW:START/g) ?? []).length, 1);
assert.match(ensureManagedImport("# User notes\n"), /NOELCREW:IMPORT:START[\s\S]*@~\/\.claude\/noelcrew\.md[\s\S]*NOELCREW:IMPORT:END/);
assert.equal(ensureManagedImport(`${noelCrewClaudeImportLine}\n`), `${noelCrewClaudeImportLine}\n`, "user-owned import line should not be wrapped as managed.");
assert.equal(removeNoelCrewMemoryBlock("custom\n<!-- NOELCREW:START -->\nmanaged\n<!-- NOELCREW:END -->\n"), "custom\n");

const dir = mkdtempSync(join(tmpdir(), "noelcrew-claude-memory-"));
try {
  const claudeDir = join(dir, ".claude");
  const claudeMd = join(claudeDir, "CLAUDE.md");
  const noelcrewMd = join(claudeDir, "noelcrew.md");
  mkdirSync(claudeDir);
  writeFileSync(claudeMd, "# Existing Claude instructions\n\nKeep this.\n", "utf8");

  const installed = installClaudeNoelCrewMemory(dir);
  assert.equal(installed.changed, true);
  assert.match(readFileSync(claudeMd, "utf8"), /Keep this\.[\s\S]*@~\/\.claude\/noelcrew\.md/);
  assert.match(readFileSync(noelcrewMd, "utf8"), /noelcrew_say/);

  const reinstalled = installClaudeNoelCrewMemory(dir);
  assert.equal(reinstalled.changed, false);
  assert.equal((readFileSync(claudeMd, "utf8").match(/@~\/\.claude\/noelcrew\.md/g) ?? []).length, 1);
  assert.match(readFileSync(claudeMd, "utf8"), /NOELCREW:IMPORT:START/);

  writeFileSync(noelcrewMd, `${readFileSync(noelcrewMd, "utf8")}\nUser custom note.\n`, "utf8");
  const uninstalled = uninstallClaudeNoelCrewMemory(dir);
  assert.equal(uninstalled.changed, true);
  assert.doesNotMatch(readFileSync(claudeMd, "utf8"), /noelcrew\.md/);
  assert.equal(existsSync(noelcrewMd), true, "customized noelcrew.md should be preserved after managed block removal.");
  assert.match(readFileSync(noelcrewMd, "utf8"), /User custom note/);

  const userImportHome = join(dir, "user-import-home");
  const userClaudeDir = join(userImportHome, ".claude");
  mkdirSync(userClaudeDir, { recursive: true });
  writeFileSync(join(userClaudeDir, "CLAUDE.md"), `# User-owned import\n${noelCrewClaudeImportLine}\n`, "utf8");
  writeFileSync(join(userClaudeDir, "noelcrew.md"), "User-owned content.\n", "utf8");
  installClaudeNoelCrewMemory(userImportHome);
  assert.doesNotMatch(readFileSync(join(userClaudeDir, "CLAUDE.md"), "utf8"), /NOELCREW:IMPORT:START/, "pre-existing import should remain user-owned.");
  uninstallClaudeNoelCrewMemory(userImportHome);
  assert.match(readFileSync(join(userClaudeDir, "CLAUDE.md"), "utf8"), /@~\/\.claude\/noelcrew\.md/, "user-owned import should not be removed.");
  assert.match(readFileSync(join(userClaudeDir, "noelcrew.md"), "utf8"), /User-owned content/, "user-owned noelcrew.md content should be preserved.");

  const symlinkHome = join(dir, "symlink-home");
  const symlinkTarget = join(dir, "outside");
  mkdirSync(symlinkHome);
  mkdirSync(symlinkTarget);
  symlinkSync(symlinkTarget, join(symlinkHome, ".claude"));
  assert.throws(() => installClaudeNoelCrewMemory(symlinkHome));

  const symlinkFileHome = join(dir, "symlink-file-home");
  mkdirSync(join(symlinkFileHome, ".claude"), { recursive: true });
  writeFileSync(join(dir, "outside-file"), "x", "utf8");
  symlinkSync(join(dir, "outside-file"), join(symlinkFileHome, ".claude", "CLAUDE.md"));
  assert.throws(() => installClaudeNoelCrewMemory(symlinkFileHome));

  const oversizedHome = join(dir, "oversized-home");
  mkdirSync(join(oversizedHome, ".claude"), { recursive: true });
  writeFileSync(join(oversizedHome, ".claude", "CLAUDE.md"), "x".repeat(1024 * 1024 + 1), "utf8");
  assert.throws(() => installClaudeNoelCrewMemory(oversizedHome));
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.error("Claude memory validation passed.");
