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
    <article className="card-interactive card-lift group relative flex flex-1 flex-col overflow-hidden">
      <div className="absolute right-0 top-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
        <MaterialIcon name={watermarkIcon} size="lg" />
      </div>
      <div className="card-pad-lg relative z-10 flex-1">
        <h3 className="type-headline-md mb-2 text-on-surface-variant">{title}</h3>
        <h2 className="type-display mb-6 text-primary">
          <AnimatedCounter value={value} />
        </h2>
        <p className="type-body-md mb-8 max-w-xs text-on-surface-variant">{description}</p>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">{metric.label}</span>
                <span className="font-bold">
                  {metric.progress != null ? (
                    <AnimatedCounter value={metric.value} />
                  ) : (
                    metric.value
                  )}
                </span>
              </div>
              {metric.progress != null && (
                <AnimatedProgressBar
                  value={metric.progress}
                  color="primary"
                  size="md"
                  className="mt-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {footerAction && (
        <div className="engagement-footer">
          <button type="button" className="text-sm font-bold text-primary hover:underline">
            {footerAction}
          </button>
        </div>
      )}
    </article>
  );
}
