import NumberFlow from '@number-flow/react';
import { useReducedMotion } from 'framer-motion';

/**
 * METRIC — the oversized rolling figure.
 *
 * In the reference, KPI values count up (346 → 682 → 1,038 → 1,248) over about
 * 1.4s on an ease-out. NumberFlow animates per-digit with real tabular metrics,
 * so the number never reflows its width while spinning — which is exactly the
 * failure mode of a naive requestAnimationFrame counter.
 *
 * `format` is Intl.NumberFormat options, so currency/compact/percent all work
 * without a second component.
 */
export function Metric({
  value,
  format,
  prefix,
  suffix,
  className = '',
  size = 'metric',
  willChange = true,
}) {
  const reduce = useReducedMotion();
  const n = Number.isFinite(value) ? value : 0;

  const sizeCls = {
    'metric-xl': 'text-metric-xl',
    metric: 'text-metric',
    'metric-sm': 'text-metric-sm',
  }[size] ?? 'text-metric';

  return (
    <div className={`font-display ${sizeCls} text-ink tabular ${className}`} data-metric>
      {reduce ? (
        <span>
          {prefix}
          {new Intl.NumberFormat('en-IN', format).format(n)}
          {suffix}
        </span>
      ) : (
        <NumberFlow
          value={n}
          format={format}
          prefix={prefix}
          suffix={suffix}
          willChange={willChange}
          /* Slow, confident settle — matches the card cascade rather than
             racing ahead of it. */
          transformTiming={{ duration: 1200, easing: 'cubic-bezier(0.22,1,0.36,1)' }}
          spinTiming={{ duration: 1400, easing: 'cubic-bezier(0.22,1,0.36,1)' }}
          opacityTiming={{ duration: 350, easing: 'ease-out' }}
        />
      )}
    </div>
  );
}

/** Rupee metric. Values arrive in PAISA (repo convention) — converted here. */
export function RupeeMetric({ paisa, className, size, compact = false }) {
  return (
    <Metric
      value={(paisa ?? 0) / 100}
      size={size}
      className={className}
      prefix="₹"
      format={
        compact
          ? { notation: 'compact', maximumFractionDigits: 1 }
          : { maximumFractionDigits: 0 }
      }
    />
  );
}

/** Small delta chip: ▲ +24% / ▼ -8% */
export function Delta({ value, suffix = '%', invert = false }) {
  if (value === null || value === undefined) return null;
  const up = value >= 0;
  const good = invert ? !up : up;
  return (
    <span className={`delta ${good ? 'delta-up' : 'delta-down'}`}>
      <span aria-hidden="true">{up ? '▲' : '▼'}</span>
      {up ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
}
