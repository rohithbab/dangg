/**
 * ADMIN API CLIENT
 *
 * Every privileged read and write goes through the `admin-api` Edge Function,
 * which holds the service_role key server-side. The browser no longer has any
 * database credential at all.
 *
 * The client sends an operation NAME plus simple params — never a table name,
 * column list or filter string. That is what keeps this from being a
 * "run any query" proxy, which would simply relocate the original hole.
 * See supabase/functions/admin-api/index.ts for the allow-list.
 */

import { getToken, logout } from './auth';

function functionsBase() {
  const url = window.__SUPABASE_URL__ || import.meta.env.VITE_SUPABASE_URL || '';
  return `${String(url).replace(/\/$/, '')}/functions/v1`;
}

/**
 * Calls one allow-listed admin operation.
 * @param {string} op      operation name, e.g. 'analytics'
 * @param {object} params  operation parameters
 */
export async function adminApi(op, params = {}) {
  const token = getToken();
  if (!token) {
    /* No usable session — bounce to login rather than firing a doomed request. */
    logout();
    window.location.assign('/login');
    throw new Error('Not authenticated');
  }

  let res;
  try {
    res = await fetch(`${functionsBase()}/admin-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ op, params }),
    });
  } catch {
    /* Network-level failure (offline, DNS, functions not deployed). Surface it
       honestly rather than letting the page render an empty shell that looks
       like "there is no data". */
    throw new Error('Cannot reach the server. Check your connection.');
  }

  if (res.status === 401 || res.status === 403) {
    /* Token expired, forged, or revoked server-side. */
    logout();
    window.location.assign('/login');
    throw new Error('Session expired');
  }

  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error('Unexpected server response');
  }

  if (!res.ok) throw new Error(body?.error || 'Request failed');
  return body.data;
}
