import { motion } from 'framer-motion';

const STATUS_DOT_CLASSES = {
  online: 'status-dot-online',
  break: 'status-dot-break',
  offline: 'status-dot-offline',
};

export function OperatorPulseCard({
  title = 'Operator Pulse',
  items,
  actionLabel = 'VIEW OPERATOR LOGS',
  onAction,
}) {
  return (
    <article className="operator-pulse-card">
      <h5 className="type-headline-md mb-4 text-ink">{title}</h5>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div 
            key={item.label} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={STATUS_DOT_CLASSES[item.status] ?? STATUS_DOT_CLASSES.offline} />
            <p className="type-body-md normal-case text-ink-2">{item.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button" 
        className="btn-operator-logs" 
        onClick={onAction}
      >
        {actionLabel}
      </motion.button>
    </article>
  );
}
