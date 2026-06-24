---
title: "Documentation"
description: "Start here for CairnID architecture, API, deployment, operations, and release gates."
category: "Start"
order: 10
source: "docs/README.md"
---
CairnID documentation is authored in this repository. The public site mirrors the selected docs as Astro content collection entries under `/docs`.

## Start Here

- [Architecture](architecture/overview.md): runtime shape, crate boundaries, storage, and deployment flow.
- [API](api.md): implemented HTTP, OIDC/OAuth, session, admin, MFA, account lifecycle, and SCIM endpoints.
- [Deployment](deployment.md): local Compose, container runtime, environment variables, and Windows build notes.
- [Operations](operations.md): release evidence, preflight, backup/restore, key rotation, audit export, and drills.
- [MCP](mcp.md): local read-only release-evidence tools over stdio.
- [Security posture](security.md): implemented controls, gaps, release evidence, and reporting boundaries.
- [Release gates](release-gates.md): required evidence before production recommendation.

## Protocol And Product Areas

- [MFA](mfa.md)
- [Account lifecycle](account-lifecycle.md)
- [SCIM](scim.md)
- [OpenID conformance](openid-conformance.md)
- [Dependency policy](dependencies.md)
- [Threat model](threat-model.md)

## Project References

- [Changelog](../CHANGELOG.md)
- [Security policy](../SECURITY.md)
- [Support](../SUPPORT.md)
- [Roadmap](../ROADMAP.md)

## Website Build

This standalone repository is the Astro project root. Documentation pages live in `src/content/docs/` as Astro content collection entries with validated metadata, and generated output goes to `dist/`.
