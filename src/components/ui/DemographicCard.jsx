import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';

const ACCENT_CLASSES = {
  primary: { bg: 'bg-primary/10', icon: 'text-on-surface' },
  secondary: { bg: 'bg-secondary/10', icon: 'text-secondary' },
  tertiary: { bg: 'bg-tertiary/10', icon: 'text-tertiary' },
};

export function DemographicCard({ icon, label, value, accent = 'primary' }) {
  const style = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.primary;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card-base card-pad flex items-center gap-4 h-full"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.bg}`}>
        <MaterialIcon name={icon} className={style.icon} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant truncate">
          {label}
        </p>
        <h5 className="text-2xl font-black tracking-tight text-on-surface leading-tight">
          <AnimatedCounter value={value} />
        </h5>
      </div>
    </motion.article>
  );
}
