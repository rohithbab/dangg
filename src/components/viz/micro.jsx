import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../motion/easing';

/**
 * MICRO-VISUALISATIONS
 *
 * The reference never shows a bare number — every KPI carries a small graphic
 * that encodes the same fact a second way. These are those primitives.
 *
 * They are deliberately axis-less and label-light: they add texture and a
 * rough sense of shape/progress next to a figure that already states the
 * precise value. Anything needing real reading gets a full chart instead.
 */

/* ── Capacity bars ────────────────────────────────────────────────────────
   Solid fill = actual, hatched remainder = headroom/target. Straight from the
   reference's "Total Employees" card. */
export function CapacityBars({ values = [], colors = ['bg-peri', 'bg-mint'], height = 46 }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-end gap-1.5" style={{ height }} aria-hidden="true">
      {values.map((v, i) => {
        const pct = Math.max(4, Math.min(100, v));
        return (
          <div key={i} className="relative w-6 overflow-hidden rounded-md" style={{ height }}>
            {/* hatched headroom */}
            <div className="absolute inset-0 rounded-md text-peri/60 hatch" />
            {/* solid actual */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 rounded-md ${colors[i % colors.length]}`}
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.09 }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ── Dot matrix ───────────────────────────────────────────────────────────
   A 1:1 unit chart — each dot is one unit, filled dots are the count. Reads
   far better than a bar for small integer counts (the reference uses it for
   "Employees on Leave"). */
export function DotMatrix({ filled = 0, total = 40, cols = 8, color = 'bg-ember' }) {
  const reduce = useReducedMotion();
  const dots = Array.from({ length: total });
  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      aria-hidden="true"
    >
      {dots.map((_, i) => {
        const on = i < filled;
        return (
          <motion.span
            key={i}
            className={`h-[5px] w-[5px] rounded-full ${on ? color : 'bg-hairline'}`}
            initial={reduce ? false : { opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.2 + i * 0.008 }}
          />
        );
      })}
    </div>
  );
}

/* ── Radial gauge ─────────────────────────────────────────────────────────
   Half-donut with a ticked remainder track. */
export function RadialGauge({ value = 0, size = 68, label }) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  // Half circle: semicircular arc length
  const circ = Math.PI * r;
  const dash = (pct / 100) * circ;

  const ticks = Array.from({ length: 22 });

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 12 }} aria-hidden="true">
      <svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
        {/* tick remainder track */}
        <g>
          {ticks.map((_, i) => {
            const a = Math.PI - (i / (ticks.length - 1)) * Math.PI;
            const x1 = cx + Math.cos(a) * (r + 1);
            const y1 = cy - Math.sin(a) * (r + 1);
            const x2 = cx + Math.cos(a) * (r + 5);
            const y2 = cy - Math.sin(a) * (r + 5);
            const passed = (i / (ticks.length - 1)) * 100 <= pct;
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={passed ? 'transparent' : '#D8D1BE'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {/* value arc */}
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#F7D6B0"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={reduce ? { strokeDashoffset: circ - dash } : { strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
        />
      </svg>
      {label && (
        <span className="absolute bottom-0 right-0 text-label-xs font-medium text-ink-3 tabular">
          {label}
        </span>
      )}
    </div>
  );
}

/* ── Split ratio bar ──────────────────────────────────────────────────────
   Two-segment proportion bar with a 2px surface gap between segments (the
   dataviz spec requires the gap so adjacent fills never blur together). */
export function SplitBar({
  a = 0, b = 0, labelA = 'A', labelB = 'B',
  colorA = 'bg-cat-2', colorB = 'bg-cat-1', loading = false,
}) {
  const reduce = useReducedMotion();
  const total = a + b || 1;
  /* While loading, hold both segments at zero and suppress the percentages —
     showing "0%" would state a fact that is not yet known. */
  const pctA = loading ? 0 : (a / total) * 100;
  const pctB = loading ? 0 : (b / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-pill">
        <motion.div
          className={`${colorA} rounded-l-pill`}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        />
        <motion.div
          className={`${colorB} rounded-r-pill`}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${pctB}%` }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        />
      </div>
      <div className="flex items-center justify-between text-label-xs text-ink-3">
        <span className="inline-flex items-center gap-1.5">
          <i className={`h-2 w-2 rounded-full ${colorA}`} />
          {labelA} <span className="tabular text-ink-2">{loading ? "—" : `${Math.round(pctA)}%`}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className={`h-2 w-2 rounded-full ${colorB}`} />
          {labelB} <span className="tabular text-ink-2">{loading ? "—" : `${Math.round(pctB)}%`}</span>
        </span>
      </div>
    </div>
  );
}

/* ── Sparkline ────────────────────────────────────────────────────────────
   Tiny trend shape. No axes by design — it shows direction, the adjacent
   figure gives the value. */
export function Sparkline({ points = [], width = 96, height = 30, color = '#E8511F', fill = true }) {
  const reduce = useReducedMotion();
  if (!points.length) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1 || 1);

  const coords = points.map((p, i) => [i * step, height - ((p - min) / span) * (height - 4) - 2]);
  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${d} L ${width} ${height} L 0 ${height} Z`;
  const id = `sp-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
      />
      {/* terminal dot marks "now" */}
      <motion.circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="3"
        fill={color}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE, delay: 1.3 }}
      />
    </svg>
  );
}

/* ── Live pulse dot ───────────────────────────────────────────────────────
   For "active now" states — a dot with an expanding ring. */
export function PulseDot({ color = 'bg-good', className = '' }) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className}`} aria-hidden="true">
      <span className={`absolute inset-0 rounded-full ${color} animate-pulse-ring`} />
      <span className={`relative h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}
