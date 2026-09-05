/**
 * DEPRECATED — do not add new usages.
 *
 * The browser must never hold a Supabase credential. All privileged reads and
 * writes now go through `src/lib/adminApi.js`, which calls the `admin-api`
 * Edge Function; the service_role key lives only in that function's environment.
 *
 * This module remains solely so that any not-yet-migrated import keeps
 * compiling. It intentionally throws on use rather than silently falling back
 * to a direct database connection — a silent fallback is how the original
 * exposure would creep back in.
 */

const GUIDANCE =
  'Direct Supabase access from the browser has been removed for security. ' +
  'Use adminApi(op, params) from src/lib/adminApi.js instead — see ' +
  'supabase/functions/admin-api/index.ts for the available operations.';

function refuse() {
  throw new Error(GUIDANCE);
}

/* A Proxy so ANY property access (.from, .rpc, .storage, …) fails loudly and
   points at the replacement, instead of returning undefined and producing a
   confusing downstream TypeError. */
export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive || prop === 'toString') return () => '[disabled supabase client]';
      refuse();
    },
    apply: refuse,
  },
);
