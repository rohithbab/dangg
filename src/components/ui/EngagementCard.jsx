import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter, AnimatedProgressBar } from '../animation';

export function EngagementCard({
  title,
  value,
  description,
  metrics = [],
  footerAction,
  watermarkIcon = 'chat_bubble',
}) {
  return (
    <article className="card-base card-lift group relative flex flex-1 flex-col overflow-hidden">
      <div className="card-pad-lg relative z-10 flex-1">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              {title}
            </p>
            <h2 className="text-4xl font-black tracking-tight text-on-surface leading-none">
              <AnimatedCounter value={value} />
            </h2>
          </div>
          <div className="rounded-2xl bg-surface-container p-3 opacity-60">
            <MaterialIcon name={watermarkIcon} size="md" className="text-on-surface" />
          </div>
        </div>

        {/* Description */}
        <p className="mb-8 max-w-xs text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>

        {/* Metrics */}
        <div className="space-y-5">
          {metrics.map((metric, i) => (
            <div key={metric.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant">{metric.label}</span>
                <span className="text-xs font-bold text-on-surface">
                  {metric.progress != null ? (
                    <AnimatedCounter value={metric.value} />
                  ) : (
                    metric.value
                  )}
                </span>
              </div>
              {metric.progress != null && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
                    className="h-full rounded-full bg-on-surface"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {footerAction && (
        <div className="engagement-footer">
          <button type="button" className="btn-link text-xs">
            {footerAction} →
          </button>
        </div>
      )}
    </article>
  );
}
