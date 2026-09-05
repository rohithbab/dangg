#!/bin/sh
set -eu

# Runtime config for the browser.
#
# SECURITY: this file is served publicly at /config.js to every visitor. It must
# therefore contain NOTHING secret. It previously wrote VITE_SUPABASE_SERVICE_KEY
# here, which handed every visitor a service_role credential — full read/write on
# the production database, bypassing RLS.
#
# The service key now lives only in the admin-api Edge Function's environment.
# The browser needs just the project URL so it can reach /functions/v1.
printf 'window.__SUPABASE_URL__ = "%s";\n' "${VITE_SUPABASE_URL}" \
  > /usr/share/nginx/html/config.js

# Fail fast if a service key is still being injected — that would mean an old
# deployment config is silently re-introducing the vulnerability.
if [ -n "${VITE_SUPABASE_SERVICE_KEY:-}" ]; then
  echo "WARNING: VITE_SUPABASE_SERVICE_KEY is set but will NOT be written to config.js." >&2
  echo "         Remove it from this service's environment; it belongs only to the" >&2
  echo "         admin-api Edge Function." >&2
fi

exec nginx -g "daemon off;"
