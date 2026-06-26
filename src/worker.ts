/// <reference types="@cloudflare/workers-types" />

const WAITLIST_PATH = '/api/waitlist';
const MAX_EMAIL_LENGTH = 254;
const MAX_FIELD_LENGTH = 512;

type WaitlistRecord = {
  email: string;
  firstSubmittedAt: string;
  lastSubmittedAt: string;
  submissions: number;
  source: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === WAITLIST_PATH) {
      return handleWaitlist(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleWaitlist(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: securityHeaders(),
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, {
      Allow: 'POST, OPTIONS',
    });
  }

  const parsed = await parseSubmission(request);
  if (!parsed.ok) {
    return jsonResponse({ ok: false, error: parsed.error }, 400);
  }

  if (parsed.honeypot !== '') {
    return jsonResponse({ ok: true });
  }

  const email = normalizeEmail(parsed.email);
  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, error: 'invalid_email' }, 400);
  }

  const key = `cloud-waitlist:v1:${await sha256Hex(email)}`;
  const now = new Date().toISOString();
  const existing = await env.WAITLIST.get<WaitlistRecord>(key, 'json');
  const record: WaitlistRecord = {
    email,
    firstSubmittedAt: existing?.firstSubmittedAt ?? now,
    lastSubmittedAt: now,
    submissions: Math.min((existing?.submissions ?? 0) + 1, 999_999),
    source: 'cairnid.com/cloud',
  };

  await env.WAITLIST.put(key, JSON.stringify(record), {
    metadata: {
      email,
      lastSubmittedAt: now,
      source: record.source,
    },
  });

  return jsonResponse({ ok: true });
}

async function parseSubmission(
  request: Request,
): Promise<{ ok: true; email: string; honeypot: string } | { ok: false; error: string }> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body: unknown = await request.json().catch(() => null);
    if (!isRecord(body)) {
      return { ok: false, error: 'invalid_body' };
    }
    return {
      ok: true,
      email: boundedString(body.email),
      honeypot: boundedString(body.company),
    };
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await request.text().catch(() => null);
    if (body === null) {
      return { ok: false, error: 'invalid_body' };
    }
    const form = new URLSearchParams(body);
    return {
      ok: true,
      email: boundedString(form.get('email')),
      honeypot: boundedString(form.get('company')),
    };
  }

  return { ok: false, error: 'unsupported_content_type' };
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return value.length > 3
    && value.length <= MAX_EMAIL_LENGTH
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function boundedString(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, MAX_FIELD_LENGTH) : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...securityHeaders(),
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

function securityHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
