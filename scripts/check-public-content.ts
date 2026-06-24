import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extname, isAbsolute, join, normalize, relative, sep } from 'node:path';

type Issue = {
  path: string;
  message: string;
};

const siteRoot = normalize(fileURLToPath(new URL('..', import.meta.url)));
const docsRoot = join(siteRoot, 'src', 'content', 'docs');
const textExtensions = new Set(['.astro', '.css', '.js', '.json', '.md', '.mjs', '.ts', '.txt']);
const skippedDirectories = new Set(['.astro', 'dist', 'node_modules']);
const joinText = (...parts: string[]) => parts.join('');
const modelInitialism = joinText('A', 'I');
const madeWord = joinText('gener', 'ated');

const bannedPhrases = [
  joinText('OpenID', ' ', 'Certified'),
  joinText('production', '-', 'ready'),
  joinText('SOC', ' ', '2'),
  joinText('T', 'B', 'N'),
  joinText('Open', modelInitialism.toLowerCase()),
  joinText(modelInitialism, '-', madeWord),
  joinText('Git', 'Hub', ' ', 'repo'),
  joinText('contact', '@', 'example'),
  joinText('TO', 'DO'),
  joinText('PLACE', 'HOLDER'),
  joinText('repo', ' ', 'is', ' ', 'live'),
  joinText('Star', ' ', 'us'),
  joinText('star', ' ', 'on', ' ', 'Git', 'Hub'),
];

const requiredFiles = [
  'astro.config.mjs',
  'tsconfig.json',
  'src/content.config.ts',
  'src/pages/index.astro',
  'src/pages/docs/index.astro',
  'src/pages/docs/[...slug].astro',
  'public/docs/assets/cairn-wordmark.svg',
  'public/docs/assets/deny.toml',
];

const issues: Issue[] = [];

for (const file of requiredFiles) {
  const path = join(siteRoot, file);
  if (!existsSync(path)) {
    issues.push({ path: normalizePath(path), message: 'required site source file is missing' });
  }
}

if (!existsSync(docsRoot)) {
  issues.push({ path: normalizePath(docsRoot), message: 'docs content collection directory is missing' });
} else {
  const docEntries = collectTextFiles(docsRoot).filter((path) => extname(path) === '.md');
  if (docEntries.length < 18) {
    issues.push({ path: normalizePath(docsRoot), message: `expected at least 18 docs entries, found ${docEntries.length}` });
  }
}

for (const filePath of collectTextFiles(siteRoot)) {
  if (isInside(filePath, docsRoot)) {
    continue;
  }

  const content = readFileSync(filePath, 'utf8');
  for (const phrase of bannedPhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push({
        path: normalizePath(filePath),
        message: `banned public wording found: ${redact(phrase)}`,
      });
    }
  }
}

if (issues.length > 0) {
  console.error('Site public content check failed.');
  console.error('');
  for (const issue of issues) {
    console.error(`- ${issue.path}: ${issue.message}`);
  }
  process.exit(1);
}

console.log('Site public content check passed.');

function collectTextFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(root)) {
    const entryPath = join(root, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      if (skippedDirectories.has(entry)) {
        continue;
      }
      files.push(...collectTextFiles(entryPath));
      continue;
    }

    if (textExtensions.has(extname(entryPath))) {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizePath(path: string): string {
  return normalize(path).replaceAll('\\', '/');
}

function isInside(path: string, root: string): boolean {
  const relativePath = relative(root, path);
  return relativePath === '' || (relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath));
}

function redact(phrase: string): string {
  return `${phrase.slice(0, 2)}...${phrase.slice(-2)}`;
}
