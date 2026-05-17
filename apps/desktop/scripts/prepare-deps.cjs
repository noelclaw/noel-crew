'use strict';

// beforePack hook — copies all production deps from pnpm junctions/workspace
// links into real directories so electron-builder can include them.
//
// Root cause: electron-builder reads the workspace root package.json for
// dep collection, not the desktop app's package.json. Workspace link: packages
// are also skipped. This script runs pnpm ls to get actual resolved paths and
// dereferences every junction or link before the asar is built.

const { execSync } = require('child_process');
const { cpSync, copyFileSync, existsSync, mkdirSync, realpathSync } = require('fs');
const { rm } = require('fs').promises;
const path = require('path');

const SKIP = new Set([]);

function isJunctionOrLink(p) {
  if (!existsSync(p)) return false;
  try { return realpathSync(p) !== p; } catch { return false; }
}

async function removeEntry(p) {
  if (process.platform === 'win32') {
    // rmdir (no /s) removes a junction without following it
    execSync(`rmdir "${p.replace(/\//g, '\\')}"`, { stdio: 'ignore', windowsHide: true });
  } else {
    await rm(p, { recursive: false });
  }
}

function copyWorkspacePkg(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  const distSrc = path.join(srcDir, 'dist');
  const pkgSrc = path.join(srcDir, 'package.json');
  if (existsSync(distSrc)) cpSync(distSrc, path.join(destDir, 'dist'), { recursive: true, dereference: true });
  if (existsSync(pkgSrc)) copyFileSync(pkgSrc, path.join(destDir, 'package.json'));
}

function copyNpmPkg(srcDir, destDir) {
  cpSync(srcDir, destDir, { recursive: true, dereference: true });
}

exports.default = async function (context) {
  const appDir = context.packager.info.projectDir;
  const nm = path.join(appDir, 'node_modules');

  console.log('[prepare-deps] Resolving production dependencies via pnpm ls...');

  const raw = execSync('pnpm ls --prod --json --depth 20', {
    cwd: appDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const list = JSON.parse(raw);
  const desktopPkg = list.find(p => p.name === '@noelclawai/desktop');
  if (!desktopPkg) { console.error('[prepare-deps] @noelclawai/desktop not found in pnpm ls output'); return; }

  const processed = new Set();

  async function processDeps(deps) {
    for (const [name, info] of Object.entries(deps || {})) {
      if (processed.has(name) || SKIP.has(name) || name.startsWith('@img/')) continue;
      processed.add(name);

      const srcDir = info.path;
      const destDir = path.join(nm, name);

      if (srcDir && existsSync(srcDir)) {
        const isLink = typeof info.version === 'string' && info.version.startsWith('link:');
        const needsCopy = !existsSync(destDir) || isJunctionOrLink(destDir);

        if (needsCopy) {
          console.log(`[prepare-deps] ${isLink ? 'workspace' : 'npm    '} ${name}`);
          try {
            if (existsSync(destDir)) await removeEntry(destDir);
            mkdirSync(path.dirname(destDir), { recursive: true });
            if (isLink) copyWorkspacePkg(srcDir, destDir);
            else copyNpmPkg(srcDir, destDir);
          } catch (e) {
            console.warn(`[prepare-deps] WARN ${name}: ${e.message}`);
          }
        }
      }

      if (info.dependencies) await processDeps(info.dependencies);
    }
  }

  await processDeps(desktopPkg.dependencies);
  console.log(`[prepare-deps] Done — ${processed.size} packages resolved.`);
};
