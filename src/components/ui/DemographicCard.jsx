import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';

const ACCENT = {
  primary: { well: 'bg-ink/8 text-ink', bar: 'bg-ink', border: 'border-l-4 border-l-on-surface' },
  secondary: { well: 'bg-info/12 text-info', bar: 'bg-info', border: 'border-l-4 border-l-secondary' },
  tertiary: { well: 'bg-warn/12 text-warn', bar: 'bg-warn', border: 'border-l-4 border-l-tertiary' },
};

export function DemographicCard({ icon, label, value, accent = 'primary', total }) {
  const a = ACCENT[accent] ?? ACCENT.primary;
  const pct = total && Number(value) > 0 ? Math.round((Number(value) / total) * 100) : null;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`flex items-center gap-4 rounded-2xl border border-hairline bg-card px-5 py-4 shadow-card ${a.border}`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.well}`}>
        <MaterialIcon name={icon} size="sm" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-2 truncate">
          {label}
        </p>
        <h5 className="font-display text-2xl font-black tracking-tight text-ink leading-none">
          <AnimatedCounter value={value} />
        </h5>
      </div>

      {pct != null && (
        <div className="shrink-0 text-right">
          <span className="font-display text-xl font-black text-ink-2/40 leading-none">
            {pct}%
          </span>
        </div>
      )}
    </motion.article>
  );
}
