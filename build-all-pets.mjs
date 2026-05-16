/**
 * Builds all 4 Noel Crew pet packs from source spritesheets.
 *
 * Output always matches defaultPetSprite.states in pet-window.ts:
 *   Out row 0: idle        (6 frames)  → idle reaction
 *   Out row 1: running-R   (8 frames)  → pet motion right
 *   Out row 2: running-L   (8 frames)  → pet motion left
 *   Out row 3: waving      (4 frames)  → waving reaction
 *   Out row 4: jumping     (5 frames)  → success + celebrating
 *   Out row 5: failed      (8 frames)  → error reaction
 *   Out row 6: waiting     (6 frames)  → waiting + testing
 *   Out row 7: running     (6 frames)  → working + editing + running
 *   Out row 8: review      (6 frames)  → thinking reaction
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ASSETS   = 'C:/Users/sagir/assets';
const OUT_BASE = 'C:/Users/sagir/pet-output';
const CODEX    = join(homedir(), '.codex', 'pets');

// ── Pet definitions ───────────────────────────────────────────────────────────
const PETS = [
  {
    id: 'deployer', displayName: 'Deployer',
    description: 'The Deployer — Noelclaw crew member.',
    file: 'deployer-spritesheet.png', srcCols: 4, srcRows: 9,
  },
  {
    id: 'igor', displayName: 'Igor',
    description: 'Igor — Noelclaw crew member.',
    file: 'igor-spritesheet.png', srcCols: 4, srcRows: 9,
  },
  {
    id: 'jesse', displayName: 'Jesse',
    description: 'Jesse — Noelclaw crew member.',
    file: 'jesse-spritesheet.png', srcCols: 5, srcRows: 6,
  },
  {
    id: 'noelclaw', displayName: 'Noelclaw',
    description: 'Noelclaw — leader of the crew.',
    file: 'noelclaw-spritesheet.png', srcCols: 4, srcRows: 9,
  },
];

// ── Output layout constants ───────────────────────────────────────────────────
const OUT_ROWS = 9;
const OUT_COLS = 8;

// ── Frame index helpers ───────────────────────────────────────────────────────
function range(start, count) {
  return Array.from({ length: count }, (_, i) => start + i);
}

// Pad or trim a sequence to exactly `len` entries by cycling from the start.
function cycle(seq, len) {
  return Array.from({ length: len }, (_, i) => seq[i % seq.length]);
}

// ── Row-frame maps per source grid ───────────────────────────────────────────

/**
 * 4×9 grid (36 frames):
 *   row 0: idle, row 1: walking, row 2: waving, row 3: celebrating,
 *   row 4: thinking, row 5: working, row 6: running, row 7: error, row 8: success
 */
function rowFrames_4x9() {
  const IDLE        = range(0,  4);
  const WALKING     = range(4,  4);
  const WAVING      = range(8,  4);
  const CELEBRATING = range(12, 4);
  const THINKING    = range(16, 4);
  const WORKING     = range(20, 4);
  const RUNNING     = range(24, 4);
  const ERROR       = range(28, 4);
  const SUCCESS     = range(32, 4);

  return [
    cycle(IDLE,        OUT_COLS),  // out row 0: idle
    cycle(RUNNING,     OUT_COLS),  // out row 1: running-right
    cycle([...RUNNING].reverse(), OUT_COLS),  // out row 2: running-left
    cycle(WAVING,      OUT_COLS),  // out row 3: waving
    cycle(SUCCESS,     OUT_COLS),  // out row 4: jumping (success + celebrating)
    cycle(ERROR,       OUT_COLS),  // out row 5: failed (error)
    cycle(THINKING,    OUT_COLS),  // out row 6: waiting (thinking frames)
    cycle(WORKING,     OUT_COLS),  // out row 7: running/working
    cycle(THINKING,    OUT_COLS),  // out row 8: review/thinking
  ];
}

/**
 * 5×6 grid (30 frames):
 *   row 0: idle, row 1: walking, row 2: waving,
 *   row 3: celebrating, row 4: working, row 5: success/running
 */
function rowFrames_5x6() {
  const IDLE        = range(0,  5);
  const WALKING     = range(5,  5);
  const WAVING      = range(10, 5);
  const CELEBRATING = range(15, 5);
  const WORKING     = range(20, 5);
  const SUCCESS     = range(25, 5);

  return [
    cycle(IDLE,                      OUT_COLS),  // out row 0: idle
    cycle(WALKING,                   OUT_COLS),  // out row 1: running-right
    cycle([...WALKING].reverse(),    OUT_COLS),  // out row 2: running-left
    cycle(WAVING,                    OUT_COLS),  // out row 3: waving
    cycle(SUCCESS,                   OUT_COLS),  // out row 4: jumping
    cycle(CELEBRATING,               OUT_COLS),  // out row 5: failed (celebrate = closest)
    cycle(WORKING,                   OUT_COLS),  // out row 6: waiting
    cycle(WORKING,                   OUT_COLS),  // out row 7: working
    cycle(IDLE,                      OUT_COLS),  // out row 8: review/thinking
  ];
}

// ── Core builder ─────────────────────────────────────────────────────────────

async function buildPet(pet) {
  const inputPath = `${ASSETS}/${pet.file}`;
  const outDir    = `${OUT_BASE}/${pet.id}`;
  const codexDir  = join(CODEX, pet.id);

  console.log(`\n── ${pet.displayName} (${pet.file}) ──────────────────────`);

  // 1. Detect source dimensions
  const meta   = await sharp(inputPath).metadata();
  const frameW = Math.floor(meta.width  / pet.srcCols);
  const frameH = Math.floor(meta.height / pet.srcRows);
  const total  = pet.srcCols * pet.srcRows;
  console.log(`   Source: ${meta.width}×${meta.height}  frame: ${frameW}×${frameH}  (${pet.srcCols}×${pet.srcRows} = ${total} frames)`);

  // 2. Extract all source frames as RGBA raw buffers
  const frames = [];
  for (let r = 0; r < pet.srcRows; r++) {
    for (let c = 0; c < pet.srcCols; c++) {
      const { data, info } = await sharp(inputPath)
        .extract({ left: c * frameW, top: r * frameH, width: frameW, height: frameH })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      frames.push({ data, width: info.width, height: info.height, channels: info.channels });
    }
  }

  // 3. Pick row-frame map for this grid size
  const map = (pet.srcCols === 4 && pet.srcRows === 9) ? rowFrames_4x9()
            : (pet.srcCols === 5 && pet.srcRows === 6) ? rowFrames_5x6()
            : (() => { throw new Error(`No row map for ${pet.srcCols}×${pet.srcRows}`); })();

  // 4. Compose the 9-row × 8-col output spritesheet
  const composite = [];
  for (let r = 0; r < OUT_ROWS; r++) {
    for (let c = 0; c < OUT_COLS; c++) {
      const idx = map[r][c];
      if (idx === undefined || idx >= frames.length) {
        throw new Error(`Frame index ${idx} out of range (${frames.length} total) at out[${r}][${c}]`);
      }
      const f = frames[idx];
      composite.push({
        input: f.data,
        raw:   { width: f.width, height: f.height, channels: f.channels },
        left:  c * frameW,
        top:   r * frameH,
      });
    }
  }

  mkdirSync(outDir, { recursive: true });
  const spritesheetPath = join(outDir, 'spritesheet.webp');

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

  console.log(`   ✓ spritesheet.webp  (${frameW * OUT_COLS}×${frameH * OUT_ROWS})`);

  // 5. Write pet.json (Codex format — validated by codex-pets-core.ts)
  const petJson = {
    id:              pet.id,
    displayName:     pet.displayName,
    description:     pet.description,
    spritesheetPath: 'spritesheet.webp',
  };
  const petJsonPath = join(outDir, 'pet.json');
  writeFileSync(petJsonPath, JSON.stringify(petJson, null, 2) + '\n', 'utf8');
  console.log(`   ✓ pet.json`);

  // 6. Copy to Codex directory
  rmSync(codexDir, { recursive: true, force: true });
  mkdirSync(codexDir, { recursive: true });

  const spritesheetBuf = await sharp(spritesheetPath).toBuffer();
  const { writeFileSync: wf } = await import('node:fs');
  wf(join(codexDir, 'spritesheet.webp'), spritesheetBuf);
  wf(join(codexDir, 'pet.json'), JSON.stringify(petJson, null, 2) + '\n', 'utf8');
  console.log(`   ✓ copied → ${codexDir}`);
}

// ── Run all pets ──────────────────────────────────────────────────────────────

console.log('Building all Noel Crew pets...');
mkdirSync(OUT_BASE, { recursive: true });
mkdirSync(CODEX,    { recursive: true });

for (const pet of PETS) {
  await buildPet(pet);
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ALL DONE.

  4 pets written to ~/.codex/pets/:
    deployer / igor / jesse / noelclaw

  To import into Noel Crew:
    Right-click tray → Pet Manager → Codex tab
    Click Import next to each character

  Test working reaction:
    node --input-type=module --eval "import{createNoelCrewClient}from'file:///C:/Users/sagir/noelcrew/packages/client/dist/index.js';createNoelCrewClient().react('working').then(r=>console.log(r)).catch(e=>console.error(e.message));"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
