# Security Policy

This repository contains the standalone CairnID public site and documentation. It is not the product runtime and is not the security policy for product/runtime vulnerabilities.

## Supported Versions

The site has no versioned release support policy. Security and documentation fixes target `main` until versioned site releases exist.

## Scope

Site security reports may include:

- Build or dependency issues in the site lockfile that affect the published static site.
- Site content or configuration that would expose secrets or direct operators toward unsafe deployment behavior.
- Broken links or documentation errors that affect security reporting or safety-critical guidance.

Product, runtime, authentication, authorization, token, session, deployment, and operator security issues are outside this site repository. Use the product's published security policy or process for those reports.

## Reporting

Do not report suspected vulnerabilities through public issues, pull requests, or comments.

For site-repository vulnerabilities in scope, use GitHub private vulnerability reporting for `cairnid/site`: <https://github.com/cairnid/site/security/advisories/new>.

Include enough detail to reproduce and assess the issue. Do not include secrets, exploit details, tokens, keys, logs, or private deployment data in public channels.

This reporting route covers only this site repository. It does not route product/runtime vulnerability reports.
