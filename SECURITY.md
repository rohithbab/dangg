# Security — Dangg Admin Panel

## What was wrong, and what changed

Until this change the browser held a Supabase **`service_role`** key, written
into a publicly-readable `/config.js` by `entrypoint.sh`. Anyone could fetch
that file unauthenticated and get **full read/write on the production database**,
bypassing RLS entirely. This was verified against production on 2026-09-05: a
`PATCH` to `/payouts` was accepted (returned `[]`, not 401/403), and 30 rapid
requests all returned 200 — no rate limiting.

Three things changed:

| Before | After |
|---|---|
| `service_role` key in every browser | Key lives only in the `admin-api` Edge Function |
| Password hardcoded in the JS bundle | Verified server-side against a hash in an env var |
| `localStorage.dangg_admin_auth = 'true'` | Signed JWT, re-verified server-side on every call |

`src/lib/supabase.js` now **throws** on use rather than returning a client, so a
direct database call cannot silently creep back in.

---

## Deployment

### 1. Generate the secrets

```bash
# Password hash (never store the plaintext anywhere)
node scripts/hash-password.mjs 'your-new-admin-password'

# JWT signing secret — 48 random bytes
openssl rand -base64 48
```

### 2. Set the Edge Function secrets

```bash
supabase secrets set \
  ADMIN_USERNAME='admin@danggapp' \
  ADMIN_PASSWORD_HASH='<sha256 hex from step 1>' \
  ADMIN_JWT_SECRET='<random string from step 1>' \
  ADMIN_ORIGIN='https://admin.dangg.app'
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by the
Edge Function runtime — do **not** set them by hand.

### 3. Deploy the functions

```bash
supabase functions deploy admin-login --no-verify-jwt
supabase functions deploy admin-api
```

`admin-login` uses `--no-verify-jwt` because it is the endpoint that *establishes*
identity — it must be reachable before the caller holds any token. It does its
own credential check and throttles failed attempts.

### 4. Remove the service key from the frontend service

In Dokploy (or whatever runs the nginx container), **delete the
`VITE_SUPABASE_SERVICE_KEY` environment variable**. Keep `VITE_SUPABASE_URL`.
The new `entrypoint.sh` refuses to write the key and logs a warning if it is
still present.

### 5. Verify

```bash
# Must contain ONLY the URL — no key
curl -s https://admin.dangg.app/config.js

# Must be 401 without a token
curl -s -o /dev/null -w '%{http_code}\n' \
  -X POST https://dangg-db.welbuiltai.in/functions/v1/admin-api \
  -H 'Content-Type: application/json' -d '{"op":"analytics"}'

# Security headers present
curl -sI https://admin.dangg.app/ | grep -iE 'content-security|x-frame|nosniff'
```

---

## ⚠️ Still outstanding: rotate the exposed key

**The old `service_role` key is still valid and has been public.** Assume it is
compromised — anyone who fetched `/config.js` at any point still holds a working
credential, and the code change above does not revoke it.

To rotate (Supabase dashboard → Settings → API → *Generate new service key*, or
for self-hosted, regenerate the JWTs and restart the stack):

1. Generate the new key.
2. Update it wherever the Edge Functions read it (managed Supabase does this
   automatically; self-hosted needs the `SERVICE_ROLE_KEY` env updated and the
   functions container restarted).
3. Confirm the admin panel still loads.
4. Confirm the **old** key is dead:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' \
     'https://dangg-db.welbuiltai.in/rest/v1/users?select=id&limit=1' \
     -H "apikey: <OLD KEY>" -H "Authorization: Bearer <OLD KEY>"
   # expect 401
   ```

Until step 4 returns 401, the database remains readable and writable by anyone
who saved the old key.

---

## Known remaining gaps

- **Rate limiting** on `admin-login` is per-instance and in-memory. It slows a
  single attacker but is not distributed. Put a WAF or gateway rate limit in
  front for real protection.
- **Token storage** is `localStorage`, not an httpOnly cookie. Chosen because the
  app and the functions are on different origins. Mitigated by the 8-hour expiry
  and by there being no XSS sink in the app (no `dangerouslySetInnerHTML`, no
  `eval`). Revisit if the functions move behind `admin.dangg.app`.
- **Single shared admin account.** There is no per-user attribution in the audit
  trail. Moving to Supabase Auth with individual accounts requires enabling the
  email provider on the Supabase instance — it is currently `email: false`,
  `phone: true` (the consumer app uses phone auth), so `signInWithPassword`
  would fail today.
