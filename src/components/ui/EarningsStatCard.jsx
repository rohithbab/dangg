import { Lift } from '../motion/primitives';

/**
 * Small stat tile used on the profile pages.
 *
 * `value` is passed in ALREADY FORMATTED by the caller (rupees, coins, a
 * rating, a coin price…). It is rendered verbatim — the previous version ran
 * every value through a currency formatter, which turned a 4.6 rating into
 * "₹5" and a coin price into "₹0".
 */
const VALUE_TONES = {
  default: 'text-ink',
  primary: 'text-ember',
  tertiary: 'text-warn',
  muted: 'text-ink-2',
};

export function EarningsStatCard({
  label,
  value,
  variant = 'default',
  valueTone = 'default',
  badge,
}) {
  const isHighlight = variant === 'highlight';
  const valueClass = isHighlight
    ? 'text-white'
    : variant === 'accent'
      ? 'text-ember'
      : VALUE_TONES[valueTone] ?? VALUE_TONES.default;

  return (
    <Lift className="h-full">
      <article
        className={`card card-pad flex h-full flex-col justify-between ${
          isHighlight ? 'card-ember' : ''
        }`}
      >
        <p className={`mb-1.5 text-label uppercase ${isHighlight ? 'text-white/70' : 'text-ink-3'}`}>
          {label}
        </p>
        <p className={`font-display text-metric-sm tabular ${valueClass}`}>{value}</p>
        {badge && <span className="earnings-highlight-badge mt-2 self-start">{badge}</span>}
      </article>
    </Lift>
  );
}
