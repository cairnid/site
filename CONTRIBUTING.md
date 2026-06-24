# Contributing

This repository contains the standalone CairnID public site and documentation. Product runtime changes belong in the main CairnID product repository and process.

Participation is covered by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report suspected vulnerabilities through [SECURITY.md](SECURITY.md), not public issues.

## Local Verification

Run these commands before opening a pull request:

```sh
bun install --frozen-lockfile
bun run check
bun run build
```

Use Bun for JavaScript package management, script execution, and local tool execution. Do not add non-Bun JavaScript lockfiles.

## Content Rules

- Keep changes site-specific and concise.
- Do not add release, support, security, conduct, or certification claims unless public organization or repository settings/docs confirm them.
- Do not include secrets, tokens, keys, private deployment data, or sensitive logs.
- Do not commit generated output such as `dist/` or `.astro/`.
- Keep product runtime documentation in the product repository unless the site intentionally links to or summarizes it.

## Pull Requests

Every pull request should include:

- What changed.
- Which verification commands were run.
- Any site content, security, or compatibility impact.
- Links to related product documentation when the site references product behavior.
