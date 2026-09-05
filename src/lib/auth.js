/**
 * ADMIN AUTH — server-verified.
 *
 * The previous version compared a hardcoded password in this file and set
 * `localStorage.dangg_admin_auth = 'true'`. Both the credential and the check
 * were client-side, so the password was readable in the bundle and anyone could
 * grant themselves access from the console.
 *
 * Now: credentials go to the `admin-login` Edge Function, which verifies them
 * server-side and returns a signed JWT. The token is what authorises every
 * privileged call, and the server re-verifies it each time — setting a value in
 * localStorage by hand grants nothing, because a forged token fails signature
 * verification at `admin-api`.
 *
 * The token is still *stored* in localStorage. That is a deliberate trade-off:
 * an httpOnly cookie would be stronger against XSS, but requires same-site
 * hosting between the app and the functions. It is mitigated by a short expiry
 * (8h) and by there being no XSS sink in this app (no dangerouslySetInnerHTML,
 * no eval). Revisit if the functions ever move behind the same domain.
 */

const TOKEN_KEY = 'dangg_admin_token';
const EXP_KEY = 'dangg_admin_token_exp';

/** Base URL of the Supabase Functions gateway, injected at runtime. */
function functionsBase() {
  const url =
    window.__SUPABASE_URL__ ||
    import.meta.env.VITE_SUPABASE_URL ||
    '';
  return `${String(url).replace(/\/$/, '')}/functions/v1`;
}

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const exp = Number(localStorage.getItem(EXP_KEY) || 0);
    if (!token || !exp) return null;
    /* Treat a token in its last minute as already gone, so a request cannot
       expire mid-flight. */
    if (Date.now() > exp - 60_000) {
      clearSession();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getToken() !== null;
}

function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
  } catch { /* private mode */ }
}

/**
 * Verifies credentials against the server.
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
export async function login(username, password) {
  let res;
  try {
    res = await fetch(`${functionsBase()}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return { ok: false, error: 'Cannot reach the server. Check your connection.' };
  }

  /* Distinguish "you typed the wrong password" from "the server is broken".
     Collapsing every non-2xx into "Invalid credentials" once sent an admin
     hunting a password problem for an hour while the real cause was an
     undeployed Edge Function returning 500. Only 401/403 mean bad credentials. */
  if (res.status === 429) {
    return { ok: false, error: 'Too many attempts. Please wait and try again.' };
  }
  if (res.status === 401 || res.status === 403) {
    return { ok: false, error: 'Invalid credentials. Please try again.' };
  }
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.clone().json();
      detail = body?.msg || body?.error || '';
    } catch { /* non-JSON error body */ }
    console.error('admin-login failed', res.status, detail);
    return {
      ok: false,
      error:
        res.status >= 500
          ? `Sign-in service is unavailable (HTTP ${res.status}). This is a server problem, not your password — contact the administrator.`
          : `Sign-in failed (HTTP ${res.status}). Please try again.`,
    };
  }

  let body;
  try {
    body = await res.json();
  } catch {
    return { ok: false, error: 'Unexpected server response.' };
  }
  if (!body?.token) return { ok: false, error: 'Unexpected server response.' };

  try {
    localStorage.setItem(TOKEN_KEY, body.token);
    localStorage.setItem(EXP_KEY, String(Date.now() + (body.expiresIn ?? 28800) * 1000));
  } catch {
    return { ok: false, error: 'Browser storage is blocked; cannot keep you signed in.' };
  }
  return { ok: true };
}

export function logout() {
  clearSession();
}
