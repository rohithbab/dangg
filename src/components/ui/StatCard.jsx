import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';

const VARIANTS = {
  primary: {
    card: 'bg-card border border-hairline shadow-card border-l-4 border-l-on-surface-variant',
    icon: 'bg-hairline/60 text-ink',
    bar: 'bg-ink',
    track: 'bg-hairline',
    label: 'text-ink-2',
    value: 'text-ink',
    pct: 'text-ink-2/50',
  },
  secondary: {
    card: 'bg-card border border-hairline shadow-card border-l-4 border-l-secondary',
    icon: 'bg-info/10 text-info',
    bar: 'bg-info',
    track: 'bg-hairline',
    label: 'text-ink-2',
    value: 'text-ink',
    pct: 'text-ink-2/50',
  },
  tertiary: {
    card: 'bg-card border border-hairline shadow-card border-l-4 border-l-tertiary',
    icon: 'bg-warn/15 text-warn',
    bar: 'bg-warn',
    track: 'bg-hairline',
    label: 'text-ink-2',
    value: 'text-ink',
    pct: 'text-ink-2/50',
  },
  dark: {
    card: 'bg-canvas-sunk border border-sidebar-border shadow-card-lift',
    icon: 'bg-ember/20 text-ember',
    bar: 'bg-ember',
    track: 'bg-white/10',
    label: 'text-ink-3',
    value: 'text-ink',
    pct: 'text-ink-3/50',
  },
};

function formatNum(v) {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? 0).replace(/[^0-9.-]/g, ''))
  if (isNaN(n)) return '0'
  const abs = Math.abs(n)
  if (abs >= 10000000) return `${(n / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`
  if (abs >= 100000) return `${(n / 100000).toFixed(1).replace(/\.0$/, '')}L`
  if (abs >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)
}

export function StatCard({ label, value, icon, trend, trendDirection = 'up', accent = 'primary', progress = 75, isCurrency = false }) {
  const v = VARIANTS[accent] ?? VARIANTS.primary;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-2xl p-6 relative overflow-hidden ${v.card}`}
    >
      {/* Top row: icon + trend badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${v.icon}`}>
          <MaterialIcon name={icon} className="!text-[16px]" />
        </div>
        {trend != null && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            trendDirection === 'down' ? 'bg-critical/10 text-critical' : 'bg-ember/15 text-ink'
          }`}>
            {trendDirection === 'up' ? '+' : ''}{trend}
          </span>
        )}
      </div>

      {/* Label */}
      <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.12em] ${v.label}`}>
        {label}
      </p>

      {/* Value */}
      <h4 className={`font-display text-3xl font-black tracking-tight leading-none ${v.value}`}>
        {isCurrency && (
          <span className="font-sans font-bold text-lg mr-0.5 opacity-50">INR</span>
        )}
        <AnimatedCounter value={value} formatter={formatNum} />
      </h4>

      {/* Progress */}
      <div className="mt-4">
        <div className={`h-[3px] w-full overflow-hidden rounded-full ${v.track}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className={`h-full rounded-full ${v.bar}`}
          />
        </div>
        <p className={`mt-1.5 text-[10px] font-medium ${v.pct}`}>
          {progress}% of target
        </p>
      </div>
    </motion.article>
  );
}
