/**
 * Builds the Deployer pet for Noel Crew from a 4×9 source spritesheet.
 *
 * Source rows (4 frames each, 36 frames total):
 *   Src row 0: idle           → frames  0- 3
 *   Src row 1: walking        → frames  4- 7
 *   Src row 2: waving         → frames  8-11
 *   Src row 3: celebrating    → frames 12-15
 *   Src row 4: thinking       → frames 16-19
 *   Src row 5: working/laptop → frames 20-23
 *   Src row 6: running        → frames 24-27
 *   Src row 7: error/dizzy    → frames 28-31
 *   Src row 8: success        → frames 32-35
 *
 * Output layout must match defaultPetSprite.states in pet-window.ts:
 *   Out row 0: idle        (6 frames)  ← idle (0-3, loop)
 *   Out row 1: running-R   (8 frames)  ← running (24-27 ×2)
 *   Out row 2: running-L   (8 frames)  ← running reversed (27-24 ×2)
 *   Out row 3: waving      (4 frames)  ← waving (8-11)
 *   Out row 4: jumping     (5 frames)  ← success (32-35, pad)  → success + celebrating reactions
 *   Out row 5: failed      (8 frames)  ← error (28-31 ×2)      → error reaction
 *   Out row 6: waiting     (6 frames)  ← thinking (16-19, pad) → waiting + testing reactions
 *   Out row 7: running     (6 frames)  ← working (20-23, pad)  → working + editing + running reactions
 *   Out row 8: review      (6 frames)  ← thinking (16-19, pad) → thinking reaction
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const INPUT_PNG  = 'C:/Users/sagir/assets/deployer-spritesheet.png';
const SRC_COLS   = 4;
const SRC_ROWS   = 9;
const OUT_DIR    = 'C:/Users/sagir/deployer-pet-output';
const ZIP_PATH   = 'C:/Users/sagir/deployer.zip';

// ── 1. Detect source frame dimensions ────────────────────────────────────────
const meta = await sharp(INPUT_PNG).metadata();
const frameW = Math.floor(meta.width  / SRC_COLS);
const frameH = Math.floor(meta.height / SRC_ROWS);
console.log(`Source: ${meta.width}×${meta.height} px  →  frame: ${frameW}×${frameH} px (${SRC_COLS}×${SRC_ROWS} grid)`);

// ── 2. Extract all 36 source frames as RGBA raw buffers ──────────────────────
const frames = [];
for (let row = 0; row < SRC_ROWS; row++) {
  for (let col = 0; col < SRC_COLS; col++) {
    const { data, info } = await sharp(INPUT_PNG)
      .extract({ left: col * frameW, top: row * frameH, width: frameW, height: frameH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    frames.push({ data, width: info.width, height: info.height, channels: info.channels });
  }
}
// Named frame ranges for readability:
const IDLE        = [0,  1,  2,  3];   // src row 0
const WALKING     = [4,  5,  6,  7];   // src row 1
const WAVING      = [8,  9,  10, 11];  // src row 2
const CELEBRATING = [12, 13, 14, 15];  // src row 3
const THINKING    = [16, 17, 18, 19];  // src row 4
const WORKING     = [20, 21, 22, 23];  // src row 5
const RUNNING     = [24, 25, 26, 27];  // src row 6
const ERROR       = [28, 29, 30, 31];  // src row 7
const SUCCESS     = [32, 33, 34, 35];  // src row 8

// ── 3. Define the 9-row output layout (8 cols each) ──────────────────────────
// Each entry is the source frame index [0..35] to place in that cell.
// Cols beyond the active frame count for that row are never shown by the
// renderer but must still be filled — we just repeat the last used frame.
const rowFrames = [
  // Out row 0: idle (6 frames active)  — loop idle frames, pad to 8
  [...IDLE, IDLE[0], IDLE[1], IDLE[0], IDLE[1]],

  // Out row 1: running-right (8 frames) — running animation ×2
  [...RUNNING, ...RUNNING],

  // Out row 2: running-left (8 frames) — running reversed ×2
  [...[...RUNNING].reverse(), ...[...RUNNING].reverse()],

  // Out row 3: waving (4 frames active) — waving ×2 (only first 4 shown)
  [...WAVING, ...WAVING],

  // Out row 4: jumping (5 frames active) — success frames, pad to 8
  [...SUCCESS, SUCCESS[0], SUCCESS[1], SUCCESS[2], SUCCESS[3]],

  // Out row 5: failed (8 frames active) — error animation ×2
  [...ERROR, ...ERROR],

  // Out row 6: waiting (6 frames active) — thinking frames, pad to 8
  [...THINKING, THINKING[0], THINKING[1], THINKING[0], THINKING[1]],

  // Out row 7: running/working (6 frames active) — working animation, pad to 8
  [...WORKING, WORKING[0], WORKING[1], WORKING[0], WORKING[1]],

  // Out row 8: review/thinking (6 frames active) — thinking frames, pad to 8
  [...THINKING, THINKING[0], THINKING[1], THINKING[0], THINKING[1]],
];

const OUT_ROWS = 9;
const OUT_COLS = 8;

// ── 4. Compose the output spritesheet ────────────────────────────────────────
const composite = [];
for (let r = 0; r < OUT_ROWS; r++) {
  for (let c = 0; c < OUT_COLS; c++) {
    const f = frames[rowFrames[r][c]];
    composite.push({
      input: f.data,
      raw: { width: f.width, height: f.height, channels: f.channels },
      left: c * frameW,
      top:  r * frameH,
    });
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const spritesheetPath = join(OUT_DIR, 'spritesheet.webp');

await sharp({
  create: {
    width:      frameW * OUT_COLS,
    height:     frameH * OUT_ROWS,
    channels:   4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(composite)
  .webp({ quality: 95, lossless: false })
  .toFile(spritesheetPath);

console.log(`✓  Spritesheet written: ${spritesheetPath}  (${frameW * OUT_COLS}×${frameH * OUT_ROWS})`);

// ── 5. Write pet.json (Codex format — validated by codex-pets-core.ts) ───────
const petJson = {
  id:             'deployer',
  displayName:    'Deployer',
  description:    'The Deployer — Noelclaw crew member.',
  spritesheetPath: 'spritesheet.webp',
};

const petJsonPath = join(OUT_DIR, 'pet.json');
writeFileSync(petJsonPath, JSON.stringify(petJson, null, 2) + '\n', 'utf8');
console.log(`✓  pet.json written: ${petJsonPath}`);

// ── 6. Copy to Codex directory (~/.codex/pets/deployer/) ─────────────────────
const codexDir = join(homedir(), '.codex', 'pets', 'deployer');
mkdirSync(codexDir, { recursive: true });

const spritesheetDst = join(codexDir, 'spritesheet.webp');
const petJsonDst     = join(codexDir, 'pet.json');

execSync(`powershell -Command "Copy-Item '${spritesheetPath.replace(/\//g,'\\\\')}' '${spritesheetDst.replace(/\//g,'\\\\')}' -Force"`);
execSync(`powershell -Command "Copy-Item '${petJsonPath.replace(/\//g,'\\\\')}' '${petJsonDst.replace(/\//g,'\\\\')}' -Force"`);
console.log(`✓  Copied to Codex:    ${codexDir}`);

// ── 7. Create zip (for reference / backup) ───────────────────────────────────
execSync(
  `powershell -Command "Compress-Archive -Path '${spritesheetPath.replace(/\//g,'\\\\')}'` +
  `,'${petJsonPath.replace(/\//g,'\\\\')}' -DestinationPath '${ZIP_PATH.replace(/\//g,'\\\\')}' -Force"`
);
console.log(`✓  Zip created:        ${ZIP_PATH}`);

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DONE.  To import into Noel Crew:
  1. Make sure Noel Crew desktop app is running
  2. Right-click tray icon → Pet Manager
  3. Switch to the "Codex" tab
  4. Find "Deployer" → click Import
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
