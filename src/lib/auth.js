/**
 * ADMIN AUTH — client-side (TEMPORARY).
 *
 * ⚠️ This is a deliberate, temporary rollback. The password below is compiled
 * into the browser bundle and the "session" is a single localStorage flag that
 * anyone can set from the console. It is NOT secure.
 *
 * It exists because the server-side replacement (the `admin-login` Edge
 * Function) is written and committed but not yet deployed to the self-hosted
 * Supabase stack, and shipping the client half alone locked every admin out.
 *
 * The secure implementation is preserved in git (commit f1c3ef5) and in
 * `supabase/functions/`. Restore it as soon as the functions are deployed —
 * see DEPLOY-FUNCTIONS.md. Until then the service_role key also remains in
 * config.js, because this file needs it to reach the database.
 *
 * All three admins share this one credential by design — no per-user accounts.
 */

const AUTH_KEY = 'dangg_admin_auth'
const ADMIN_USERNAME = 'admin@danggapp'
const ADMIN_PASSWORD = 'Admin@Danggapp2026'

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

/**
 * Verifies credentials.
 *
 * Returns the SAME `{ ok, error }` shape as the server-side version, so
 * LoginPage works unchanged against either implementation. Returning a bare
 * boolean here would make `result.ok` undefined and silently reject every
 * correct password — which is exactly what a naive rollback produces.
 *
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
export async function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    try {
      localStorage.setItem(AUTH_KEY, 'true')
    } catch {
      return { ok: false, error: 'Browser storage is blocked; cannot keep you signed in.' }
    }
    return { ok: true }
  }
  return { ok: false, error: 'Invalid credentials. Please try again.' }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY)
    /* Also clear any token from the server-side version, so a stale one cannot
       linger and confuse a later migration back. */
    localStorage.removeItem('dangg_admin_token')
    localStorage.removeItem('dangg_admin_token_exp')
  } catch { /* private mode */ }
}
