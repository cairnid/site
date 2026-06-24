import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import icon from 'astro-icon';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const docsRoutes = new Map([
  ['docs/readme.md', '/docs/'],
  ['readme.md', '/docs/'],
  ['docs/architecture/overview.md', '/docs/architecture/'],
  ['architecture/overview.md', '/docs/architecture/'],
  ['docs/api.md', '/docs/api/'],
  ['api.md', '/docs/api/'],
  ['docs/deployment.md', '/docs/deployment/'],
  ['deployment.md', '/docs/deployment/'],
  ['docs/operations.md', '/docs/operations/'],
  ['operations.md', '/docs/operations/'],
  ['docs/mcp.md', '/docs/mcp/'],
  ['mcp.md', '/docs/mcp/'],
  ['docs/security.md', '/docs/security/'],
  ['security.md', '/docs/security/'],
  ['docs/release-gates.md', '/docs/release-gates/'],
  ['release-gates.md', '/docs/release-gates/'],
  ['docs/threat-model.md', '/docs/threat-model/'],
  ['threat-model.md', '/docs/threat-model/'],
  ['docs/mfa.md', '/docs/mfa/'],
  ['mfa.md', '/docs/mfa/'],
  ['docs/account-lifecycle.md', '/docs/account-lifecycle/'],
  ['account-lifecycle.md', '/docs/account-lifecycle/'],
  ['docs/scim.md', '/docs/scim/'],
  ['scim.md', '/docs/scim/'],
  ['docs/openid-conformance.md', '/docs/openid-conformance/'],
  ['openid-conformance.md', '/docs/openid-conformance/'],
  ['docs/dependencies.md', '/docs/dependencies/'],
  ['dependencies.md', '/docs/dependencies/'],
  ['CHANGELOG.md', '/docs/changelog/'],
  ['changelog.md', '/docs/changelog/'],
  ['../changelog.md', '/docs/changelog/'],
  ['../CHANGELOG.md', '/docs/changelog/'],
  ['docs/changelog.md', '/docs/changelog/'],
  ['SECURITY.md', '/docs/security-policy/'],
  ['../SECURITY.md', '/docs/security-policy/'],
  ['../security.md', '/docs/security-policy/'],
  ['security-policy.md', '/docs/security-policy/'],
  ['SUPPORT.md', '/docs/support/'],
  ['support.md', '/docs/support/'],
  ['../SUPPORT.md', '/docs/support/'],
  ['../support.md', '/docs/support/'],
  ['ROADMAP.md', '/docs/roadmap/'],
  ['roadmap.md', '/docs/roadmap/'],
  ['../ROADMAP.md', '/docs/roadmap/'],
  ['../roadmap.md', '/docs/roadmap/'],
  ['../deny.toml', '/docs/assets/deny.toml'],
  ['deny.toml', '/docs/assets/deny.toml'],
]);

export default defineConfig({
  site: 'https://cairnid.com',
  output: 'static',
  outDir: 'dist',
  integrations: [icon(), react(), sitemap({ filter: (page) => !page.includes('/cloud/') })],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  markdown: {
    processor: unified({
      remarkPlugins: [rewriteRepositoryDocLinks],
    }),
  },
});

function rewriteRepositoryDocLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if ((node.type === 'link' || node.type === 'image') && typeof node.url === 'string') {
        node.url = rewriteDocUrl(node.url);
      }
    });
  };
}

function visit(node, visitor) {
  visitor(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    visit(child, visitor);
  }
}

function rewriteDocUrl(rawUrl) {
  const cleanUrl = rawUrl.replace(/^<|>$/g, '').trim();

  if (
    cleanUrl === ''
    || cleanUrl.startsWith('#')
    || cleanUrl.startsWith('mailto:')
    || cleanUrl.startsWith('tel:')
    || cleanUrl.startsWith('http://')
    || cleanUrl.startsWith('https://')
  ) {
    return cleanUrl;
  }

  const { path, suffix } = splitUrlSuffix(cleanUrl);
  const normalizedPath = path.replaceAll('\\', '/').replace(/^\.\//, '');
  const mappedRoute = docsRoutes.get(normalizedPath) ?? docsRoutes.get(normalizedPath.toLowerCase());

  if (mappedRoute) {
    return `${mappedRoute}${suffix}`;
  }

  return cleanUrl;
}

function splitUrlSuffix(url) {
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');
  const indexes = [hashIndex, queryIndex].filter((index) => index >= 0);
  const suffixIndex = indexes.length > 0 ? Math.min(...indexes) : -1;

  if (suffixIndex === -1) {
    return { path: url, suffix: '' };
  }

  return {
    path: url.slice(0, suffixIndex),
    suffix: url.slice(suffixIndex),
  };
}
