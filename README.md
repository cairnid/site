# CairnID Site

Standalone Astro site and documentation surface for CairnID.

This repository is intentionally separate from the product repository. It builds
a static Astro site, uses Tailwind CSS v4 utilities through CairnID design
tokens, and deploys to Cloudflare Workers Static Assets with Wrangler.

## Stack

- Astro 7 static output
- Bun 1.3.14 for install, checks, builds, and Wrangler invocation
- Tailwind CSS v4 utilities with a token bridge in `src/styles/app.css`
- CairnID design tokens in `src/styles/tokens.css`
- Reusable `cn-*` component classes in `src/styles/components.css`
- Astro UI primitives in `src/components/ui`
- Cloudflare Workers Static Assets, not Cloudflare Pages

Tailwind is used for layout and composition. Product controls should not be
rebuilt ad hoc: if a repeated UI pattern is missing, add the token-backed
component class and Astro wrapper first, then document it on `/ui`.

## Local Commands

Install dependencies:

```sh
bun install
```

Run the local dev server:

```sh
bun run dev
```

Run type and public-content checks:

```sh
bun run check
```

Build the static site into `dist/`:

```sh
bun run build
```

Preview the built site:

```sh
bun run preview
```

Run the same static Worker deploy validation used before publishing:

```sh
bun run deploy:dry-run
```

Wrangler is invoked through the local Bun-managed CLI; no separate JavaScript
runtime command is required for local `deploy` and `deploy:dry-run` runs.

## Design System

The design system is source controlled with the site:

- `src/styles/tokens.css` owns color, type, spacing, radii, shadow, focus, and motion.
- `src/styles/app.css` maps those tokens into Tailwind v4 theme variables.
- `src/styles/components.css` owns reusable `cn-*` component behavior and state.
- `src/components/ui` exposes Astro wrappers for reusable controls.
- `src/pages/ui/index.astro` is the public design-system reference.

External component sites can be used as interaction references, but no third
party UI library should be installed or copied wholesale into this repository.
Keep the CairnID token system as the source of truth.

## Deployment

The source of truth is `wrangler.jsonc`:

- `assets.directory` points at `./dist`.
- `assets.binding` exposes the static asset binding to the Worker script.
- `assets.not_found_handling` uses `404-page`.
- `kv_namespaces` binds `WAITLIST` for the temporary Cloud email waitlist.
- `routes` attaches the Worker to `cairnid.com` and `www.cairnid.com` as custom domains.

GitHub Actions builds on pushes to `main` and deploys with
`cloudflare/wrangler-action@v4`. The repository must have:

- GitHub Actions variable `CLOUDFLARE_ACCOUNT_ID`
- GitHub Actions secret `CLOUDFLARE_API_TOKEN`

## Repository Hygiene

Do not commit generated output, credentials, or local tool state.

Ignored locally:

- `dist/`
- `.astro/`
- `.wrangler/`
- `.env*`

Before publishing, run:

```sh
bun install --frozen-lockfile
bun run check
bun run build
```

Temporary Cloud waitlist submissions are stored in Workers KV under
`cloud-waitlist:v1:<sha256(email)>` until Resend or a dedicated CRM workflow is
connected.

To inspect entries:

```sh
bun --bun wrangler kv key list --namespace-id c35cd7bd49484e59b1131b8702dcd5d8 --prefix cloud-waitlist:v1:
bun --bun wrangler kv key get --namespace-id c35cd7bd49484e59b1131b8702dcd5d8 <key>
```
