import { MaterialIcon } from './MaterialIcon';

/**
 * Shown when a page's data request fails.
 *
 * Without this, a failed fetch left every figure at its zero placeholder — a
 * dashboard reading "₹0 / 0 users" looks like a quiet business, not a broken
 * connection. An operator could easily act on that. Silence is the dangerous
 * failure mode here, so the page says plainly that the numbers are missing.
 */
export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;

  const message =
    typeof error === 'string' ? error : error?.message || 'Something went wrong.';

  return (
    <div
      role="alert"
      className="card card-pad flex flex-wrap items-center gap-3 border-l-2 border-l-critical"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-well bg-critical-soft text-critical">
        <MaterialIcon name="error" size="sm" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-ink">Couldn’t load this data</p>
        <p className="text-body-sm text-ink-2">{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-ghost shrink-0">
          <MaterialIcon name="refresh" size="sm" />
          Retry
        </button>
      )}
    </div>
  );
}
