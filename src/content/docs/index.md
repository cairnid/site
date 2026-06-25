---
title: "Documentation"
description: "Start here for CairnID architecture, API, deployment, operations, and release gates."
category: "Start"
order: 10
source: "docs/README.md"
---
CairnID documentation is authored in this repository. The public site mirrors the selected docs as Astro content collection entries under `/docs`.

## Start Here

- [Architecture](/docs/architecture/): runtime shape, crate boundaries, storage, and deployment flow.
- [API](/docs/api/): implemented HTTP, OIDC/OAuth, session, admin, MFA, account lifecycle, and SCIM endpoints.
- [Deployment](/docs/deployment/): local Compose, container runtime, environment variables, and Windows build notes.
- [Operations](/docs/operations/): release evidence, preflight, backup/restore, key rotation, audit export, and drills.
- [MCP](/docs/mcp/): local read-only release-evidence tools over stdio.
- [Security posture](/docs/security/): implemented controls, gaps, release evidence, and reporting boundaries.
- [Release gates](/docs/release-gates/): required evidence before production recommendation.

## Protocol And Product Areas

- [MFA](/docs/mfa/)
- [Account lifecycle](/docs/account-lifecycle/)
- [SCIM](/docs/scim/)
- [OpenID conformance](/docs/openid-conformance/)
- [Dependency policy](/docs/dependencies/)
- [Threat model](/docs/threat-model/)

## Project References

- [Changelog](/docs/changelog/)
- [Security policy](/docs/security-policy/)
- [Support](/docs/support/)
- [Roadmap](/docs/roadmap/)

## Website Build

This standalone repository is the Astro project root. Documentation pages live in `src/content/docs/` as Astro content collection entries with validated metadata, and generated output goes to `dist/`.
