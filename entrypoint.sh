#!/bin/sh
printf 'window.__SUPABASE_URL__ = "%s";\nwindow.__SUPABASE_SERVICE_KEY__ = "%s";\n' \
  "$VITE_SUPABASE_URL" \
  "$VITE_SUPABASE_SERVICE_KEY" \
  > /usr/share/nginx/html/config.js
exec nginx -g "daemon off;"
