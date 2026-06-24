// One-off: rasterize the OG card + apple-touch-icon from the cairn mark via sharp.
import sharp from 'sharp';

// Cairn mark (3 stacked stones), brightened for dark backgrounds.
const cairn = (s, x, y) => `
  <g transform="translate(${x},${y}) scale(${s / 48})">
    <rect x="6" y="31" width="36" height="10" rx="5" fill="#12876F"/>
    <rect x="12" y="18.5" width="24" height="10" rx="5" fill="#1EA487"/>
    <rect x="17" y="6" width="14" height="10" rx="5" fill="#34BFA1"/>
  </g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="34%" r="42%">
      <stop offset="0%" stop-color="#12876F" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#1a1714" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#1a1714"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${cairn(132, 534, 120)}
  <text x="600" y="392" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="104" font-weight="700" letter-spacing="-3" fill="#f0ebe2" text-anchor="middle">Cairn<tspan fill="#34bfa1">ID</tspan></text>
  <text x="600" y="452" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="32" font-weight="400" fill="#bbb3a4" text-anchor="middle">Strict OIDC and OAuth you can audit</text>
  <text x="600" y="556" font-family="Consolas, monospace" font-size="22" letter-spacing="2" fill="#8c8475" text-anchor="middle">SELF-HOST - OPEN SOURCE - CLOUD COMING SOON</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#1a1714"/>
  ${cairn(116, 32, 36)}
</svg>`;

await sharp(Buffer.from(og)).png().toFile('public/og-cairnid.png');
await sharp(Buffer.from(icon)).png().toFile('public/apple-touch-icon.png');
console.log('wrote public/og-cairnid.png + public/apple-touch-icon.png');
