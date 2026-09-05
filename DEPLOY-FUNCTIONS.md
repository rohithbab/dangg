# Deploying the admin Edge Functions (self-hosted Supabase)

## Why you're reading this

Login is currently **broken for anyone without an existing browser session**.
The frontend was deployed calling `admin-login`, but that function is not yet
running on the server, so every attempt returns:

```
500  InvalidWorkerCreation: worker boot error:
     could not find an appropriate entrypoint
```

Anyone still logged in has a token from before the deploy and will keep working
until it expires. Everyone else is locked out. These steps fix that.

> Your instance is **self-hosted** (Kong gateway at `dangg-db.welbuiltai.in`),
> not Supabase Cloud — so `supabase functions deploy` does **not** apply. The
> functions container serves whatever is in its mounted `functions` volume.

---

## Step 1 — Copy the function folders to the server

From this repo, `supabase/functions/` contains two folders: `admin-login/` and
`admin-api/`, each with an `index.ts`.

Copy them into the Supabase stack's functions volume — typically
`<supabase-docker-dir>/volumes/functions/`:

```bash
scp -r supabase/functions/admin-login  user@your-server:/path/to/supabase/volumes/functions/
scp -r supabase/functions/admin-api    user@your-server:/path/to/supabase/volumes/functions/
```

Afterwards the server should look like:

```
volumes/functions/
├── main/            (may already exist — leave it)
├── admin-login/
│   └── index.ts
└── admin-api/
    └── index.ts
```

The `index.ts` filename matters — "could not find an appropriate entrypoint"
is exactly what you get when it is missing or misnamed.

---

## Step 2 — Set the secrets

Add these to the **functions** service environment (the `.env` your
`docker-compose.yml` feeds to the `functions` container):

```bash
ADMIN_USERNAME=admin@danggapp
ADMIN_PASSWORD_HASH=33bcba32641d9def9bf3c2cb6475d6bdd869416b1291c0cedb79ab6757620e41
ADMIN_JWT_SECRET=<paste the generated secret — see note below>
ADMIN_ORIGIN=https://admin.dangg.app
```

- The hash above is the SHA-256 of your **current** password
  (`Admin@Danggapp2026`), so **nothing changes for your three admins** — they
  keep using the same shared credential on their own laptops.
- `ADMIN_JWT_SECRET` must be a long random string. Generate one with
  `openssl rand -base64 48`. Keep it out of git and out of chat.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually already present in
  the functions container. If not, add them — `admin-api` needs them.

To change the password later:
`node scripts/hash-password.mjs 'new-password'` → update `ADMIN_PASSWORD_HASH`
→ restart the container. Never store the plaintext.

---

## Step 3 — Restart the functions container

```bash
docker compose restart functions
# or:  docker compose up -d functions
```

---

## Step 4 — Verify

```bash
# 1. Correct credentials -> 200 with a token
curl -s -X POST https://dangg-db.welbuiltai.in/functions/v1/admin-login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin@danggapp","password":"Admin@Danggapp2026"}'
# expect: {"token":"eyJ...","expiresIn":28800}

# 2. Wrong credentials -> 401
curl -s -o /dev/null -w '%{http_code}\n' \
  -X POST https://dangg-db.welbuiltai.in/functions/v1/admin-login \
  -H 'Content-Type: application/json' -d '{"username":"x","password":"y"}'
# expect: 401

# 3. admin-api rejects a missing token -> 401
curl -s -o /dev/null -w '%{http_code}\n' \
  -X POST https://dangg-db.welbuiltai.in/functions/v1/admin-api \
  -H 'Content-Type: application/json' -d '{"op":"analytics"}'
# expect: 401
```

Then open https://admin.dangg.app in a **private window** (no existing session)
and sign in. All three admins should now be able to log in from their own
machines with the same shared credential.

---

## Step 5 — Close the key exposure (do this in the same window)

Only after Step 4 passes:

1. **Remove `VITE_SUPABASE_SERVICE_KEY`** from the *frontend* service's
   environment in Dokploy. Keep `VITE_SUPABASE_URL`. Redeploy the frontend.
2. Confirm the key is gone:
   ```bash
   curl -s https://admin.dangg.app/config.js
   # must show ONLY window.__SUPABASE_URL__
   ```
3. **Rotate the exposed service_role key.** It has been publicly readable, so
   assume it is compromised. See `SECURITY.md`.

Until step 1 is done the panel still works, but the key remains public.

---

## If something goes wrong

Roll back instantly by reverting the frontend commit — the old client-side
login returns and everyone can work again:

```bash
git revert f1c3ef5 && git push
```

That re-exposes the key, so treat it as a temporary unblock, not a fix.
