---
title: "Product Support Policy"
description: "Product/runtime support scope for usage questions, bug reports, and security reports."
category: "Project"
order: 170
source: "Product runtime support policy"
---
This page documents the CairnID product/runtime support policy. It is not sourced from the standalone site root `SUPPORT.md`, which covers site-only support.

Cairn Identity is an open-source project in pre-beta development. Product/runtime support should keep usage questions, non-security bugs, and vulnerability reports separated so reports are handled safely.

## Questions and Usage

Use only support routes that the product repository or organization has published. When asking a product/runtime question, include:

- The version or commit you are running.
- Deployment target: local, Docker Compose, Kubernetes, or another container environment.
- Sanitized configuration names and command output.
- What you expected and what happened.

Do not include passwords, bearer tokens, authorization codes, private keys, database URLs, cookies, or release evidence that contains provider secrets.

## Bugs

Report non-security defects only through the product repository or organization issue process when that process is available for the affected component. Include reproduction steps, relevant logs with secrets removed, and whether the issue affects authentication, authorization, audit, provisioning, deployment, or UI behavior.

## Security

Do not open public issues for vulnerabilities. Follow [SECURITY.md](/docs/security-policy/).
