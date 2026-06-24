/*
 * GitHub star count, fetched once at build time.
 *
 * The site is static and runs under a strict CSP that forbids runtime requests
 * to external origins, so the star count is resolved during `astro build` (where
 * outbound requests are fine) and baked into the HTML  -  never fetched from the
 * browser. The result is memoized for the lifetime of the build process so the
 * API is hit at most once regardless of how many pages render the masthead.
 *
 * If the request fails (offline build, rate limit, missing repo) the count is
 * `null` and the badge simply renders without it.
 */

export const GITHUB_REPO = 'cairnid/cairnid';
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

let cached: number | null | undefined;

export async function getStarCount(repo: string = GITHUB_REPO): Promise<number | null> {
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'cairnid-site',
      },
    });

    if (!response.ok) {
      cached = null;
      return cached;
    }

    const data = (await response.json()) as { stargazers_count?: unknown };
    cached = typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
    return cached;
  } catch {
    cached = null;
    return cached;
  }
}

export function formatStars(count: number): string {
  if (count >= 1000) {
    const thousands = count / 1000;
    return `${thousands.toFixed(thousands >= 10 ? 0 : 1).replace(/\.0$/, '')}k`;
  }

  return String(count);
}
