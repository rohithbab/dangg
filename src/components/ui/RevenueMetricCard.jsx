import { MaterialIcon } from './MaterialIcon';
import { Lift } from '../motion/primitives';
import { Metric, RupeeMetric } from '../motion/Metric';

/**
 * Compact stat card used by the payout/revenue stat rows.
 *
 * `accent` tints only the icon well — the figure itself stays ink, so a row of
 * five of these does not turn into five competing colours.
 */
const WELLS = {
  primary: 'bg-ember-soft text-ember',
  secondary: 'bg-info-soft text-info',
  tertiary: 'bg-warn-soft text-warn',
  error: 'bg-critical-soft text-critical',
  good: 'bg-good-soft text-good',
};

export function RevenueMetricCard({ label, value, icon, accent = 'primary', badge, isCount = false }) {
  const well = WELLS[accent] ?? WELLS.primary;

  return (
    <Lift className="h-full">
      <article className="card card-pad flex h-full flex-col justify-between">
        <div className="mb-4 flex items-start justify-between gap-2">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-well ${well}`}>
            <MaterialIcon name={icon} size="sm" />
          </span>
          {badge && <div className="min-w-0 shrink">{badge}</div>}
        </div>

        <div>
          <p className="metric-label mb-1.5 truncate">{label}</p>
          {isCount ? (
            <Metric value={Number(value) || 0} size="metric-sm" />
          ) : (
            <RupeeMetric paisa={Number(value) || 0} size="metric-sm" />
          )}
        </div>
      </article>
    </Lift>
  );
}
