import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter, AnimatedProgressBar } from '../animation';
import { formatCurrency } from '../../utils/formatters';

const VARIANTS = {
  primary: {
    card: 'bg-surface shadow-card border border-outline-variant',
    icon: 'bg-primary/15 text-on-surface',
    progress: 'bg-on-surface',
    label: 'text-on-surface-variant',
    value: 'text-on-surface',
  },
  secondary: {
    card: 'bg-surface shadow-card border border-outline-variant',
    icon: 'bg-secondary/10 text-secondary',
    progress: 'bg-secondary',
    label: 'text-on-surface-variant',
    value: 'text-on-surface',
  },
  tertiary: {
    card: 'bg-surface shadow-card border border-outline-variant',
    icon: 'bg-tertiary/15 text-tertiary',
    progress: 'bg-tertiary',
    label: 'text-on-surface-variant',
    value: 'text-on-surface',
  },
  /* Dark "hero" variant — used for first stat card */
  dark: {
    card: 'bg-sidebar shadow-card-lift border border-sidebar-border',
    icon: 'bg-primary/20 text-on-sidebar-active',
    progress: 'bg-primary',
    label: 'text-on-sidebar-muted',
    value: 'text-on-sidebar',
  },
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendDirection = 'up',
  accent = 'primary',
  progress = 75,
}) {
  const v = VARIANTS[accent] ?? VARIANTS.primary;

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgb(14 14 13 / 0.22)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`rounded-2xl p-6 group relative overflow-hidden ${v.card}`}
    >
      {/* Subtle corner accent circle */}
      <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-current opacity-[0.04] transition-all group-hover:scale-150" />

      {/* Top row */}
      <div className="mb-5 flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${v.icon}`}>
          <MaterialIcon name={icon} size="sm" />
        </div>
        {trend != null && (
          <span className={trendDirection === 'down' ? 'badge-trend-down' : 'badge-trend-up'}>
            {trendDirection === 'up' ? '+' : ''}{trend}
          </span>
        )}
      </div>

      {/* Label */}
      <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.12em] ${v.label}`}>
        {label}
      </p>

      {/* Value — Syne font for punch */}
      <h4 className={`font-display text-3xl font-black tracking-tight leading-none ${v.value}`}>
        <AnimatedCounter value={value} formatter={formatCurrency} />
      </h4>

      {/* Progress track */}
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-black/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className={`h-full rounded-full ${v.progress}`}
        />
      </div>

      <p className={`mt-1.5 text-[10px] font-medium ${v.label} opacity-60`}>
        {progress}% of target
      </p>
    </motion.article>
  );
}
