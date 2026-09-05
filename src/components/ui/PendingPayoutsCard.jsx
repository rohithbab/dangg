import { MaterialIcon } from './MaterialIcon';

export function PendingPayoutsCard({
  count = 12,
  title = 'Pending Requests',
  subtitle = 'Awaiting approval for disbursement',
  actionLabel = 'Review All Requests',
  onAction,
}) {
  return (
    <article className="card-base flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline bg-canvas-sunk px-6 py-5">
        <div>
          <h5 className="text-sm font-bold text-ink">{title}</h5>
          <p className="mt-0.5 text-xs text-ink-2">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-critical-soft text-critical">
          <MaterialIcon name="schedule" fill size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center">
        <div className="mb-2 text-6xl font-black tracking-tight leading-none text-ink">
          {count}
        </div>
        <p className="mb-8 text-[11px] font-bold uppercase tracking-widest text-ink-2">
          Total Pending Payouts
        </p>
        <button
          type="button"
          className="btn-primary w-full justify-center"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
