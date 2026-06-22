import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter, AnimatedProgressBar } from '../animation';
import { formatCurrency } from '../../utils/formatters';

const WELL_CLASSES = {
  primary: 'icon-well-primary',
  secondary: 'icon-well-secondary',
  tertiary: 'icon-well-tertiary',
};

const PROGRESS_COLORS = {
  primary: 'bg-on-surface',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
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
  const well = WELL_CLASSES[accent] ?? WELL_CLASSES.primary;
  const progressColor = PROGRESS_COLORS[accent] ?? PROGRESS_COLORS.primary;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="card-base card-pad group relative overflow-hidden"
    >
      {/* Top row */}
      <div className="mb-5 flex items-start justify-between">
        <div className={well}>
          <MaterialIcon name={icon} size="sm" />
        </div>
        {trend != null && (
          <span className={trendDirection === 'down' ? 'badge-trend-down' : 'badge-trend-up'}>
            {trendDirection === 'up' ? '+' : ''}{trend}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>

      {/* Value */}
      <h4 className="text-2xl font-black tracking-tight text-on-surface leading-none">
        <AnimatedCounter value={value} formatter={formatCurrency} />
      </h4>

      {/* Progress track */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full ${progressColor}`}
        />
      </div>

      {/* Progress label */}
      <p className="mt-1.5 text-[10px] font-semibold text-on-surface-variant/60">
        {progress}% of target
      </p>

      {/* Subtle corner accent */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 transition-all group-hover:scale-150 group-hover:bg-primary/8" />
    </motion.article>
  );
}
