import sharp from "sharp";
import { renameSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "../apps/desktop/assets");

// ─── Logo SVG — "Noel Crew" branded badge ────────────────────────────────────
// Matches original 1448×1086
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086">
  <defs>
    <!-- Dark radial background -->
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#16162a"/>
      <stop offset="100%" stop-color="#07070f"/>
    </radialGradient>
    <!-- Cyan glow filter -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Subtle text glow -->
    <filter id="textglow" x="-10%" y="-30%" width="120%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Badge gradient -->
    <linearGradient id="badgeFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1e38"/>
      <stop offset="100%" stop-color="#10101e"/>
    </linearGradient>
    <!-- Border gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d4ff"/>
      <stop offset="50%" stop-color="#7b5ff0"/>
      <stop offset="100%" stop-color="#00d4ff"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1448" height="1086" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <g opacity="0.06" stroke="#00d4ff" stroke-width="1">
    <!-- Vertical lines -->
    <line x1="200" y1="0" x2="200" y2="1086"/>
    <line x1="400" y1="0" x2="400" y2="1086"/>
    <line x1="600" y1="0" x2="600" y2="1086"/>
    <line x1="800" y1="0" x2="800" y2="1086"/>
    <line x1="1000" y1="0" x2="1000" y2="1086"/>
    <line x1="1200" y1="0" x2="1200" y2="1086"/>
    <!-- Horizontal lines -->
    <line x1="0" y1="180" x2="1448" y2="180"/>
    <line x1="0" y1="360" x2="1448" y2="360"/>
    <line x1="0" y1="540" x2="1448" y2="540"/>
    <line x1="0" y1="720" x2="1448" y2="720"/>
    <line x1="0" y1="900" x2="1448" y2="900"/>
  </g>

  <!-- Corner accent lines -->
  <g stroke="#00d4ff" stroke-width="3" opacity="0.5">
    <polyline points="60,60 60,140 140,140" fill="none"/>
    <polyline points="1388,60 1388,140 1308,140" fill="none"/>
    <polyline points="60,1026 60,946 140,946" fill="none"/>
    <polyline points="1388,1026 1388,946 1308,946" fill="none"/>
  </g>

  <!-- Main badge — outer glow ring -->
  <polygon points="724,180 964,230 1024,460 924,690 724,740 524,690 424,460 484,230"
    fill="none" stroke="url(#borderGrad)" stroke-width="6" opacity="0.9" filter="url(#glow)"/>

  <!-- Main badge — body -->
  <polygon points="724,196 956,244 1010,462 914,682 724,724 534,682 438,462 492,244"
    fill="url(#badgeFill)" stroke="url(#borderGrad)" stroke-width="3"/>

  <!-- Inner badge accent ring -->
  <polygon points="724,220 940,264 990,464 900,668 724,706 548,668 458,464 508,264"
    fill="none" stroke="#7b5ff0" stroke-width="1.5" opacity="0.4"/>

  <!-- Top icon: pixel cat face -->
  <!-- Head -->
  <rect x="694" y="258" width="60" height="50" rx="6" fill="#00d4ff" opacity="0.9"/>
  <!-- Ears -->
  <polygon points="694,270 682,248 706,262" fill="#00d4ff"/>
  <polygon points="754,270 766,248 742,262" fill="#00d4ff"/>
  <!-- Eyes -->
  <rect x="703" y="272" width="12" height="12" rx="2" fill="#0a0a12"/>
  <rect x="733" y="272" width="12" height="12" rx="2" fill="#0a0a12"/>
  <!-- Pupils glow -->
  <rect x="705" y="274" width="6" height="6" rx="1" fill="#00d4ff" opacity="0.6"/>
  <rect x="735" y="274" width="6" height="6" rx="1" fill="#00d4ff" opacity="0.6"/>
  <!-- Nose -->
  <rect x="720" y="288" width="8" height="6" rx="2" fill="#0a0a12"/>
  <!-- Whiskers -->
  <line x1="680" y1="290" x2="714" y2="292" stroke="#fff" stroke-width="2" opacity="0.6"/>
  <line x1="734" y1="292" x2="768" y2="290" stroke="#fff" stroke-width="2" opacity="0.6"/>

  <!-- "NOEL" text -->
  <text x="724" y="470"
    font-family="Arial Black, Impact, sans-serif"
    font-size="172"
    font-weight="900"
    text-anchor="middle"
    letter-spacing="8"
    fill="#ffffff"
    filter="url(#textglow)">NOEL</text>

  <!-- "NOEL" text cyan outline layer -->
  <text x="724" y="470"
    font-family="Arial Black, Impact, sans-serif"
    font-size="172"
    font-weight="900"
    text-anchor="middle"
    letter-spacing="8"
    fill="none"
    stroke="#00d4ff"
    stroke-width="3"
    opacity="0.7">NOEL</text>

  <!-- Separator dots -->
  <circle cx="604" cy="500" r="7" fill="#00d4ff" opacity="0.8"/>
  <circle cx="624" cy="500" r="7" fill="#00d4ff" opacity="0.5"/>
  <circle cx="820" cy="500" r="7" fill="#00d4ff" opacity="0.5"/>
  <circle cx="840" cy="500" r="7" fill="#00d4ff" opacity="0.8"/>

  <!-- "CREW" text -->
  <text x="724" y="630"
    font-family="Arial Black, Impact, sans-serif"
    font-size="172"
    font-weight="900"
    text-anchor="middle"
    letter-spacing="8"
    fill="#ffffff"
    filter="url(#textglow)">CREW</text>

  <!-- "CREW" text purple outline layer -->
  <text x="724" y="630"
    font-family="Arial Black, Impact, sans-serif"
    font-size="172"
    font-weight="900"
    text-anchor="middle"
    letter-spacing="8"
    fill="none"
    stroke="#7b5ff0"
    stroke-width="3"
    opacity="0.7">CREW</text>

  <!-- Bottom star -->
  <polygon points="724,750 734,778 764,778 741,795 750,824 724,807 698,824 707,795 684,778 714,778"
    fill="#ffd700" opacity="0.9"/>

  <!-- Decorative pixel stars scattered -->
  <g fill="#ffffff" opacity="0.6">
    <!-- Top-left area -->
    <rect x="160" y="200" width="10" height="10"/>
    <rect x="155" y="205" width="20" height="2"/>
    <polygon points="165,190 168,200 178,200 170,207 173,217 165,210 157,217 160,207 152,200 162,200" fill="#00d4ff" opacity="0.5"/>

    <!-- Top-right area -->
    <polygon points="1283,200 1286,210 1296,210 1288,217 1291,227 1283,220 1275,227 1278,217 1270,210 1280,210" fill="#7b5ff0" opacity="0.5"/>

    <!-- Bottom-left -->
    <polygon points="200,880 203,890 213,890 205,897 208,907 200,900 192,907 195,897 187,890 197,890" fill="#00d4ff" opacity="0.4"/>

    <!-- Bottom-right -->
    <polygon points="1248,880 1251,890 1261,890 1253,897 1256,907 1248,900 1240,907 1243,897 1235,890 1245,890" fill="#ffd700" opacity="0.4"/>
  </g>

  <!-- Subtitle -->
  <text x="724" y="980"
    font-family="Arial, sans-serif"
    font-size="42"
    font-weight="400"
    text-anchor="middle"
    letter-spacing="6"
    fill="#7b5ff0"
    opacity="0.9">DESKTOP PET COMPANION</text>
</svg>`;

// ─── Pets badge overlay — replace the OpenPets paw emblem ────────────────────
// The paw badge is centered near the bottom of the 1254×1254 image
// Roughly at center-x=627, center-y=1110, radius ~130px
const badgeOverlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="290" height="290">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1e38"/>
      <stop offset="100%" stop-color="#10101e"/>
    </linearGradient>
    <linearGradient id="border2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d4ff"/>
      <stop offset="50%" stop-color="#7b5ff0"/>
      <stop offset="100%" stop-color="#00d4ff"/>
    </linearGradient>
  </defs>
  <!-- Octagonal badge -->
  <polygon points="145,10 235,40 280,130 250,225 145,260 40,225 10,130 55,40"
    fill="url(#bg2)" stroke="url(#border2)" stroke-width="4"/>
  <polygon points="145,22 228,50 270,132 242,220 145,248 48,220 20,132 62,50"
    fill="none" stroke="#7b5ff0" stroke-width="1.5" opacity="0.4"/>
  <!-- NC initials -->
  <text x="145" y="120"
    font-family="Arial Black, Impact, sans-serif"
    font-size="72"
    font-weight="900"
    text-anchor="middle"
    fill="#ffffff">NC</text>
  <text x="145" y="120"
    font-family="Arial Black, Impact, sans-serif"
    font-size="72"
    font-weight="900"
    text-anchor="middle"
    fill="none"
    stroke="#00d4ff"
    stroke-width="2"
    opacity="0.7">NC</text>
  <!-- Noel Crew label below -->
  <text x="145" y="165"
    font-family="Arial, sans-serif"
    font-size="22"
    font-weight="700"
    text-anchor="middle"
    letter-spacing="2"
    fill="#7b5ff0">NOEL CREW</text>
  <!-- Bottom star -->
  <polygon points="145,190 150,205 166,205 153,215 158,230 145,221 132,230 137,215 124,205 140,205"
    fill="#ffd700" opacity="0.9"/>
</svg>`;

async function generate() {
  // 1. Logo
  console.log("Generating onboarding-logo.webp...");
  await sharp(Buffer.from(logoSvg))
    .resize(1448, 1086)
    .webp({ quality: 92 })
    .toFile(join(assetsDir, "onboarding-logo.webp"));
  console.log("  ✓ onboarding-logo.webp");

  // 2. Pets — composite NC badge over the OpenPets paw emblem
  console.log("Generating onboarding-pets.webp...");
  const badgeBuf = await sharp(Buffer.from(badgeOverlaySvg))
    .resize(290, 290)
    .png()
    .toBuffer();

  const petsTmp = join(assetsDir, "onboarding-pets.tmp.webp");
  await sharp(join(assetsDir, "onboarding-pets.webp"))
    .composite([{
      input: badgeBuf,
      // Center the badge horizontally; bottom badge in original sits ~y=970
      left: Math.round((1254 - 290) / 2),
      top: 960,
    }])
    .webp({ quality: 92 })
    .toFile(petsTmp);
  // Swap on Windows: copy over the original (avoids EBUSY on rename/unlink)
  const { execSync } = await import("child_process");
  const dest = join(assetsDir, "onboarding-pets.webp");
  execSync(`copy /Y "${petsTmp}" "${dest}"`, { shell: "cmd.exe" });
  unlinkSync(petsTmp);
  console.log("  ✓ onboarding-pets.webp");

  console.log("\nDone.");
}

generate().catch((e) => { console.error(e); process.exit(1); });
