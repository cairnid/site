// One-off: convert Archivo OTF -> WOFF2 (subset to Latin + typographic punctuation)
// and subset JetBrains Mono (machine values only -> ASCII) to WOFF2.
// Browsers do per-glyph fallback, so any glyph outside the subset still renders
// from the next font in the stack — subsetting here is safe.
import subsetFont from 'subset-font';
import { readFile, writeFile, stat, unlink } from 'node:fs/promises';

const FONTS = 'public/fonts';

// Comprehensive Latin charset for UI/heading text.
const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('');
const latin1 = Array.from({ length: 0xff - 0xa0 + 1 }, (_, i) => String.fromCharCode(0xa0 + i)).join('');
const typographic = '–—‘’‚“”„…‹›«»•·′″€←→↑↓↔×÷±≥≤≈≠∞©®™°№§✓✗';
const LATIN = ascii + latin1 + typographic;
const MONO = ascii; // hex, base64, IDs, URLs, JWKS — ASCII only

const jobs = [
  { in: 'Archivo-Regular.otf', out: 'Archivo-Regular.woff2', text: LATIN },
  { in: 'Archivo-Medium.otf', out: 'Archivo-Medium.woff2', text: LATIN },
  { in: 'Archivo-SemiBold.otf', out: 'Archivo-SemiBold.woff2', text: LATIN },
  { in: 'Archivo-Bold.otf', out: 'Archivo-Bold.woff2', text: LATIN },
  { in: 'JetBrainsMono-Regular.woff2', out: 'JetBrainsMono-Regular.woff2', text: MONO },
  { in: 'JetBrainsMono-Medium.woff2', out: 'JetBrainsMono-Medium.woff2', text: MONO },
  { in: 'JetBrainsMono-SemiBold.woff2', out: 'JetBrainsMono-SemiBold.woff2', text: MONO },
];

const kb = (n) => (n / 1024).toFixed(1) + 'KB';

for (const j of jobs) {
  const src = `${FONTS}/${j.in}`;
  const dst = `${FONTS}/${j.out}`;
  const before = (await stat(src)).size;
  const buf = await readFile(src);
  const out = await subsetFont(buf, j.text, { targetFormat: 'woff2' });
  await writeFile(dst, out);
  if (j.in !== j.out) await unlink(src); // drop the source OTF
  console.log(`${j.in.padEnd(28)} ${kb(before).padStart(8)} -> ${kb(out.length).padStart(8)}  (${j.out})`);
}
console.log('done');
