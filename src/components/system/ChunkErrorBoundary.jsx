import { Component } from 'react';
import { MaterialIcon } from '../ui/MaterialIcon';

/**
 * Recovers from stale-deploy chunk failures.
 *
 * Every page is a `React.lazy` import, so the browser fetches
 * /assets/<Page>-<hash>.js on navigation. The hash changes on every deploy and
 * the old file is gone. A tab that loaded index.html before a deploy therefore
 * asks for a chunk that no longer exists, and React Router's default boundary
 * renders a raw "Unexpected Application Error! Failed to fetch dynamically
 * imported module". A manual refresh fixes it because that re-fetches
 * index.html — which is exactly what admins were doing by hand.
 *
 * So: detect that specific failure and reload once, automatically.
 *
 * The sessionStorage guard is what makes this safe. If the reload does NOT fix
 * it — the asset is genuinely missing, not just stale — reloading again would
 * spin forever, so the second failure shows a real error instead.
 *
 * The guard stores a TIMESTAMP, not a boolean, and it is never cleared on a
 * successful render. Clearing it on success is the obvious-looking approach and
 * it is wrong: this boundary wraps every route, so any other page mounting
 * would wipe the flag, every reload would look like the first, and the tab
 * would reload forever. Verified by reproducing exactly that loop.
 *
 * Instead the flag simply expires. A failure within the window means the
 * reload already happened and did not help → show the error. A failure after it
 * is treated as a fresh incident and gets its own single reload.
 */

const RELOAD_KEY = 'dangg_chunk_reloaded_at';

/* Long enough to cover a reload plus the chunk re-request, short enough that a
   genuinely new deploy hours later still recovers automatically. */
const RELOAD_WINDOW_MS = 30_000;

/* Returns true when a recovery reload already happened moments ago. */
function reloadedRecently() {
  try {
    const at = Number(sessionStorage.getItem(RELOAD_KEY));
    if (!at) return false;
    /* A clock change could put `at` in the future; treat that as recent too
       rather than allowing an unbounded loop. */
    return Date.now() - at < RELOAD_WINDOW_MS || at > Date.now();
  } catch {
    /* Storage unreadable — assume we already tried, so we never loop. */
    return true;
  }
}

/* Browsers word this differently (Chrome/Safari "Failed to fetch dynamically
   imported module", Firefox "error loading dynamically imported module"), and
   Vite's preload helper throws its own. Match the shapes, not one string. */
function isStaleChunkError(error) {
  const msg = String(error?.message || error || '');
  return (
    /dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /Failed to fetch dynamically/i.test(msg) ||
    /ChunkLoadError/i.test(String(error?.name || ''))
  );
}

export class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    if (!isStaleChunkError(error)) return;
    if (reloadedRecently()) return; // already tried; render the error instead

    try {
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      /* Storage blocked — without a guard we cannot promise the reload
         terminates, so do not reload at all. Show the manual fallback. */
      return;
    }

    /* Reload from the network so the new index.html (and its new asset hashes)
       replaces the stale cached one. */
    window.location.reload();
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const stale = isStaleChunkError(error);

    /* A reload is about to happen — render nothing rather than flashing an
       error card at the admin for the split second before the page goes. */
    if (stale && !reloadedRecently()) return null;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="card card-pad-lg mx-auto max-w-md space-y-5 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-warn-soft text-warn">
            <MaterialIcon name={stale ? 'sync_problem' : 'error_outline'} className="!text-[28px]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-display-md text-ink">
              {stale ? 'This page was updated' : 'Something went wrong'}
            </h2>
            <p className="text-body-sm text-ink-2">
              {stale
                ? 'A new version of the panel was deployed while this tab was open, and it could not reload itself. Reloading will pick up the latest version.'
                : 'This page failed to load. Reloading usually clears it.'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary w-full justify-center py-2.5"
            onClick={() => {
              try {
                sessionStorage.removeItem(RELOAD_KEY);
              } catch { /* private mode */ }
              window.location.reload();
            }}
          >
            <MaterialIcon name="refresh" className="!text-[18px]" />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
