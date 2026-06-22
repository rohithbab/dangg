import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';

export function EngagementCard({
  title,
  value,
  description,
  metrics = [],
  footerAction,
  watermarkIcon = 'chat_bubble',
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-1 flex-col rounded-2xl border border-outline-variant bg-surface shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-outline-variant">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
              {title}
            </p>
            <h2 className="font-display text-5xl font-black tracking-tight text-on-surface leading-none">
              <AnimatedCounter value={value} />
            </h2>
            {description && (
              <p className="mt-2 text-[11px] leading-snug max-w-[280px] text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container">
            <MaterialIcon name={watermarkIcon} size="sm" className="text-on-surface-variant" />
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="flex-1 divide-y divide-outline-variant/50">
          {metrics.map((metric, i) => (
            <div key={metric.label} className="flex items-center gap-4 px-6 py-3">
              <span className="min-w-0 flex-1 text-xs font-medium text-on-surface-variant truncate">
                {metric.label}
              </span>
              <span className="font-display text-base font-black text-on-surface tabular-nums">
                <AnimatedCounter value={metric.value} />
              </span>
              {metric.progress != null && (
                <div className="w-20 shrink-0">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 }}
                      className="h-full rounded-full bg-on-surface"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {footerAction && (
        <div className="border-t border-outline-variant px-6 py-3">
          <button
            type="button"
            className="text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
          >
            {footerAction}
            <MaterialIcon name="arrow_forward" className="!text-[12px]" />
          </button>
        </div>
      )}
    </motion.article>
  );
}
