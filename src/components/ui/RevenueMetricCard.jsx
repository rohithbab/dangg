import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';
import { formatCurrency } from '../../utils/formatters';

const ICON_WELLS = {
  primary: 'metric-icon-well-primary',
  secondary: 'metric-icon-well-secondary',
  tertiary: 'metric-icon-well-tertiary',
  error: 'icon-well-alert',
};

export function RevenueMetricCard({ label, value, icon, accent = 'primary', badge }) {
  const well = ICON_WELLS[accent] ?? ICON_WELLS.primary;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="card-base card-pad group flex h-full flex-col justify-between overflow-hidden relative"
    >
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 transition-all group-hover:scale-150 group-hover:bg-primary/8" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-2">
          <div className={`${well} shrink-0`}>
            <MaterialIcon name={icon} size="sm" />
          </div>
          {badge && <div className="min-w-0 shrink">{badge}</div>}
        </div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant truncate">
          {label}
        </p>
      </div>
      <h4 className="text-2xl font-black tracking-tight text-on-surface leading-none mt-2">
        <AnimatedCounter value={value} formatter={formatCurrency} />
      </h4>
    </motion.article>
  );
}
