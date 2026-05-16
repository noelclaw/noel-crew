/**
 * Builds all 4 pet spritesheets for Noel Crew:
 *   1. Auto-detects frame size (imageWidth/srcCols × imageHeight/srcRows)
 *   2. Removes solid background via flood-fill from corners (skipped if corners are transparent)
 *   3. Resizes each frame to 192×208 (Noel Crew thumbnail extractor dimensions)
 *   4. Composes a 9-row × 8-col output spritesheet (1536×1872 px)
 *   5. Writes pet.json + copies to ~/.codex/pets/<id>/
 *
 * Source row layout (all 4 pets are 4×9):
 *   row 0: idle        row 1: walking     row 2: waving
 *   row 3: celebrating row 4: thinking    row 5: working
 *   row 6: running     row 7: error       row 8: success
 *
 * Output row → Noel Crew reaction:
 *   row 0: idle (6f)       → idle
 *   row 1: running-R (8f)  → walking right (src row 1)
 *   row 2: running-L (8f)  → walking left  (src row 1 reversed)
 *   row 3: waving (4f)     → waving        (src row 2)
 *   row 4: jumping (5f)    → celebrating + success (src rows 3+8)
 *   row 5: failed (8f)     → error         (src row 7)
 *   row 6: waiting (6f)    → thinking      (src row 4)
 *   row 7: running (6f)    → working + running (src rows 5+6)
 *   row 8: review (6f)     → thinking      (src row 4)
 */

import sharp from 'sharp';
import { statSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ASSETS   = 'C:/Users/sagir/assets';
const OUT_BASE = 'C:/Users/sagir/pet-output';
const CODEX    = join(homedir(), '.codex', 'pets');

const FRAME_W  = 192;  // output frame width  — matches Noel Crew thumbnail extractor
const FRAME_H  = 208;  // output frame height — matches Noel Crew thumbnail extractor
const OUT_COLS = 8;
const OUT_ROWS = 9;

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
    file: 'jesse-spritesheet.png', srcCols: 4, srcRows: 9,
  },
  {
    id: 'noelclaw', displayName: 'Noelclaw',
    description: 'Noelclaw — leader of the crew.',
    file: 'noelclaw-spritesheet.png', srcCols: 4, srcRows: 9,
  },
];

// ── Background removal ────────────────────────────────────────────────────────

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

function removeBackground(pixels, width, height, tolerance) {
  const CH = 4;
  const cornerPositions = [
    0,
    width - 1,
    (height - 1) * width,
    (height - 1) * width + (width - 1),
  ];

  const bgColors = [];
  for (const pos of cornerPositions) {
    const i = pos * CH;
    const c = { r: pixels[i], g: pixels[i+1], b: pixels[i+2] };
    if (!bgColors.some(bc => colorDist(bc.r,bc.g,bc.b,c.r,c.g,c.b) < 10)) {
      bgColors.push(c);
    }
  }

  const isBg = (r, g, b, a) => {
    if (a === 0) return true;
    return bgColors.some(bc => colorDist(r,g,b,bc.r,bc.g,bc.b) <= tolerance);
  };

  const visited = new Uint8Array(width * height);
  const stack   = [];

  for (const pos of cornerPositions) {
    if (visited[pos]) continue;
    const i = pos * CH;
    if (isBg(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3])) {
      visited[pos] = 1;
      stack.push(pos);
    }
  }

  while (stack.length > 0) {
    const pos = stack.pop();
    const x = pos % width;
    const y = (pos - x) / width;

    pixels[pos * CH + 3] = 0;

    const neighbors = [
      x > 0          ? pos - 1     : -1,
      x < width - 1  ? pos + 1     : -1,
      y > 0          ? pos - width : -1,
      y < height - 1 ? pos + width : -1,
    ];

    for (const npos of neighbors) {
      if (npos < 0 || visited[npos]) continue;
      const ni = npos * CH;
      if (isBg(pixels[ni], pixels[ni+1], pixels[ni+2], pixels[ni+3])) {
        visited[npos] = 1;
        stack.push(npos);
      }
    }
  }
}

// ── Frame sequence helpers ────────────────────────────────────────────────────

const range = (start, n) => Array.from({ length: n }, (_, i) => start + i);
const cycle = (seq, len) => Array.from({ length: len }, (_, i) => seq[i % seq.length]);
const rev   = (arr) => [...arr].reverse();

// All 4 pets share this source layout (4 cols × 9 rows):
//   src row 0: idle        frames  0- 3
//   src row 1: walking     frames  4- 7
//   src row 2: waving      frames  8-11
//   src row 3: celebrating frames 12-15
//   src row 4: thinking    frames 16-19
//   src row 5: working     frames 20-23
//   src row 6: running     frames 24-27
//   src row 7: error       frames 28-31
//   src row 8: success     frames 32-35
function makeRowMap_4x9() {
  const IDLE  = range(0,  4);  // idle
  const WALK  = range(4,  4);  // walking
  const WAVE  = range(8,  4);  // waving
  const CELEB = range(12, 4);  // celebrating
  const THINK = range(16, 4);  // thinking
  const WORK  = range(20, 4);  // working
  const RUN   = range(24, 4);  // running
  const ERR   = range(28, 4);  // error
  const SUCC  = range(32, 4);  // success

  return [
    cycle(IDLE,                OUT_COLS),  // out row 0: idle
    cycle(WALK,                OUT_COLS),  // out row 1: running-right (walking animation)
    cycle(rev(WALK),           OUT_COLS),  // out row 2: running-left  (reversed)
    cycle(WAVE,                OUT_COLS),  // out row 3: waving
    cycle([...CELEB, ...SUCC], OUT_COLS),  // out row 4: jumping (celebrating + success)
    cycle(ERR,                 OUT_COLS),  // out row 5: failed (error)
    cycle(THINK,               OUT_COLS),  // out row 6: waiting (thinking)
    cycle([...WORK, ...RUN],   OUT_COLS),  // out row 7: running/working (working + running)
    cycle(THINK,               OUT_COLS),  // out row 8: review (thinking)
  ];
}

// ── Core builder ─────────────────────────────────────────────────────────────

async function buildPet(pet) {
  const inputPath = `${ASSETS}/${pet.file}`;
  const outDir    = `${OUT_BASE}/${pet.id}`;
  const codexDir  = join(CODEX, pet.id);

  console.log(`\n── ${pet.displayName}  (src ${pet.srcCols}×${pet.srcRows})  ─────────────`);

  // 1. Auto-detect frame size
  const meta = await sharp(inputPath).metadata();
  const srcW = Math.floor(meta.width  / pet.srcCols);
  const srcH = Math.floor(meta.height / pet.srcRows);
  console.log(`   spritesheet: ${meta.width}×${meta.height}  frame: ${srcW}×${srcH} (auto)`);

  // 2. Load raw RGBA pixels
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(data);

  // 3. Remove background — skip if top-left corner is already transparent
  const topLeftAlpha = pixels[3];
  if (topLeftAlpha > 0) {
    const i0 = 0;
    console.log(`   bg color: rgba(${pixels[i0]},${pixels[i0+1]},${pixels[i0+2]},${topLeftAlpha})  removing...`);
    removeBackground(pixels, info.width, info.height, 50);
    console.log(`   ✓ background removed`);
  } else {
    console.log(`   ✓ already transparent`);
  }

  // 4. Extract frames → resize each to FRAME_W × FRAME_H
  const frameBuffers = [];
  for (let r = 0; r < pet.srcRows; r++) {
    for (let c = 0; c < pet.srcCols; c++) {
      const left = c * srcW;
      const top  = r * srcH;

      const cropBuf = Buffer.allocUnsafe(srcW * srcH * 4);
      for (let row = 0; row < srcH; row++) {
        for (let col = 0; col < srcW; col++) {
          const srcIdx = ((top + row) * info.width + (left + col)) * 4;
          const dstIdx = (row * srcW + col) * 4;
          cropBuf[dstIdx]   = pixels[srcIdx];
          cropBuf[dstIdx+1] = pixels[srcIdx+1];
          cropBuf[dstIdx+2] = pixels[srcIdx+2];
          cropBuf[dstIdx+3] = pixels[srcIdx+3];
        }
      }

      const { data: resData } = await sharp(cropBuf, {
        raw: { width: srcW, height: srcH, channels: 4 },
      })
        .resize(FRAME_W, FRAME_H, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      frameBuffers.push(resData);
    }
  }
  console.log(`   ✓ ${frameBuffers.length} frames extracted → ${FRAME_W}×${FRAME_H}`);

  // 5. Get row-frame map
  if (!(pet.srcCols === 4 && pet.srcRows === 9)) {
    throw new Error(`No map for ${pet.srcCols}×${pet.srcRows} — all pets must be 4×9`);
  }
  const map = makeRowMap_4x9();

  // 6. Compose the 1536×1872 output spritesheet
  const composite = [];
  for (let row = 0; row < OUT_ROWS; row++) {
    for (let col = 0; col < OUT_COLS; col++) {
      const idx = map[row][col];
      if (idx === undefined || idx >= frameBuffers.length) {
        throw new Error(`Frame index ${idx} out of range (${frameBuffers.length} total) at out[${row}][${col}]`);
      }
      composite.push({
        input: frameBuffers[idx],
        raw:   { width: FRAME_W, height: FRAME_H, channels: 4 },
        left:  col * FRAME_W,
        top:   row * FRAME_H,
      });
    }
  }

  mkdirSync(outDir, { recursive: true });
  const spritesheetPath = join(outDir, 'spritesheet.webp');

  await sharp({
    create: {
      width:      FRAME_W * OUT_COLS,
      height:     FRAME_H * OUT_ROWS,
      channels:   4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composite)
    .webp({ quality: 95, lossless: false })
    .toFile(spritesheetPath);

  const sizeKB = Math.round(statSync(spritesheetPath).size / 1024);
  console.log(`   ✓ spritesheet.webp  ${FRAME_W * OUT_COLS}×${FRAME_H * OUT_ROWS}  ${sizeKB} KB`);

  // 7. Write pet.json
  const petJson = {
    id:              pet.id,
    displayName:     pet.displayName,
    description:     pet.description,
    spritesheetPath: 'spritesheet.webp',
  };
  writeFileSync(join(outDir, 'pet.json'), JSON.stringify(petJson, null, 2) + '\n', 'utf8');
  console.log(`   ✓ pet.json`);

  // 8. Copy to ~/.codex/pets/<id>/
  rmSync(codexDir, { recursive: true, force: true });
  mkdirSync(codexDir, { recursive: true });

  const spriteBuf = await sharp(spritesheetPath).toBuffer();
  writeFileSync(join(codexDir, 'spritesheet.webp'), spriteBuf);
  writeFileSync(join(codexDir, 'pet.json'), JSON.stringify(petJson, null, 2) + '\n', 'utf8');
  console.log(`   ✓ → ${codexDir}`);
}

// ── Run all ───────────────────────────────────────────────────────────────────

console.log('=== Noel Crew — Build All Pets ===');
console.log(`Output: ${FRAME_W * OUT_COLS}×${FRAME_H * OUT_ROWS} spritesheet (${FRAME_W}×${FRAME_H} per frame)`);
mkdirSync(OUT_BASE, { recursive: true });

for (const pet of PETS) {
  await buildPet(pet);
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ALL DONE — 4 pets ready in ~/.codex/pets/

  In Noel Crew:
    tray icon → Pet Manager → Codex tab
    click Import next to each character

  Test reactions:
    node C:/Users/sagir/react-hook.mjs working
    node C:/Users/sagir/react-hook.mjs celebrating
    node C:/Users/sagir/react-hook.mjs error
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
