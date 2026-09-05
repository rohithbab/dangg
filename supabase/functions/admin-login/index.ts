/**
 * admin-login — issues a short-lived, signed admin session token.
 *
 * WHY THIS EXISTS
 * The previous design compared a hardcoded password inside the browser bundle
 * and then set `localStorage.dangg_admin_auth = 'true'`. Both the password and
 * the check were client-side, so anyone could read the credential or simply
 * set the flag. This function moves the check to the server: the password lives
 * only in an environment variable, and the browser receives a JWT it cannot
 * forge.
 *
 * The token is verified by `admin-api` on every privileged call. It is signed
 * with ADMIN_JWT_SECRET (distinct from Supabase's own JWT secret so that an
 * admin token is never mistaken for a user token, and vice versa).
 *
 * Deploy:
 *   supabase functions deploy admin-login --no-verify-jwt
 *   (--no-verify-jwt because this endpoint is what establishes identity;
 *    it must be reachable before the caller has any token.)
 *
 * Required secrets:
 *   ADMIN_USERNAME       e.g. admin@danggapp
 *   ADMIN_PASSWORD_HASH  sha256 hex of the password (see scripts/hash-password.mjs)
 *   ADMIN_JWT_SECRET     long random string, min 32 chars
 */

import { create, getNumericDate } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ADMIN_ORIGIN') ?? 'https://admin.dangg.app',
  'Access-Control-Allow-Headers': 'content-type, authorization, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/* Constant-time compare so response timing cannot be used to guess the hash. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ── Brute-force throttle ──────────────────────────────────────────────────
   In-memory per-IP counter. This is deliberately simple: Edge Function
   instances are ephemeral and not shared, so it slows down a single attacker
   without pretending to be a distributed rate limiter. Put a real WAF/rate
   limit in front for that. */
const attempts = new Map<string, { n: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function throttled(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { n: 1, first: now });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_ATTEMPTS;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const USER = Deno.env.get('ADMIN_USERNAME');
  const HASH = Deno.env.get('ADMIN_PASSWORD_HASH');
  const SECRET = Deno.env.get('ADMIN_JWT_SECRET');
  if (!USER || !HASH || !SECRET) {
    console.error('admin-login: missing required env vars');
    return json({ error: 'Server not configured' }, 500);
  }

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  if (throttled(ip)) {
    return json({ error: 'Too many attempts. Try again later.' }, 429);
  }

  let username = '';
  let password = '';
  try {
    const body = await req.json();
    username = String(body?.username ?? '');
    password = String(body?.password ?? '');
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const suppliedHash = await sha256Hex(password);
  const ok = timingSafeEqual(username, USER) && timingSafeEqual(suppliedHash, HASH);

  if (!ok) {
    /* Deliberately vague — never reveal which half was wrong. */
    return json({ error: 'Invalid credentials' }, 401);
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

  const token = await create(
    { alg: 'HS256', typ: 'JWT' },
    {
      sub: 'admin',
      role: 'dangg_admin',
      iat: getNumericDate(0),
      exp: getNumericDate(60 * 60 * 8), // 8h — one working day, then re-auth
    },
    key,
  );

  attempts.delete(ip);
  return json({ token, expiresIn: 60 * 60 * 8 });
});
