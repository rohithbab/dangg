import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { StatusBadge } from './StatusBadge';
import { AnimatedProgressBar } from '../animation';

const ICON_WELLS = {
  primary: 'stat-icon-well-lg-primary',
  secondary: 'stat-icon-well-lg-secondary',
  tertiary: 'stat-icon-well-lg-tertiary',
  error: 'stat-icon-well-lg-error',
};

const CARD_TINTS = {
  primary: 'bg-primary/5',
  secondary: 'bg-blue-50/60',
  tertiary: 'bg-amber-50/40',
  error: 'bg-rose-50/60',
};

const BADGE_CLASSES = {
  'trend-up': 'badge-trend-up',
  'trend-down': 'badge-trend-down',
  error: 'stat-badge-error',
  neutral: 'badge-neutral',
};

function ChatStatFooter({ footer }) {
  if (!footer) return null;

  if (footer.type === 'progress') {
    return <AnimatedProgressBar value={footer.percent} color={footer.color ?? 'primary'} className="mt-4" />;
  }

  if (footer.type === 'progressLabeled') {
    return (
      <div className="mt-4 flex items-center gap-2">
        <AnimatedProgressBar
          value={footer.percent}
          color={footer.color ?? 'secondary'}
          size="md"
          className="flex-1"
        />
        <span className="font-label-sm text-label-sm normal-case text-on-surface-variant">{footer.label}</span>
      </div>
    );
  }

  if (footer.type === 'text') {
    return <p className="type-body-md mt-4 normal-case text-on-surface-variant">{footer.text}</p>;
  }

  if (footer.type === 'segments') {
    return (
      <div className="segment-bar-row">
        {footer.segments.map((active, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className={active ? 'segment-bar-active' : 'segment-bar-inactive'} 
          />
        ))}
      </div>
    );
  }

  if (footer.type === 'pills') {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {footer.pills.map((pill, i) => (
          <motion.span 
            key={pill.label} 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={pill.active ? 'day-pill-active' : 'day-pill'}
          >
            {pill.label}
          </motion.span>
        ))}
      </div>
    );
  }

  return null;
}

export function ChatStatCard({
  label,
  value,
  icon,
  iconFill = false,
  accent = 'primary',
  badge,
  badgeVariant = 'trend-up',
  footer,
}) {
  const well = ICON_WELLS[accent] ?? ICON_WELLS.primary;
  const badgeClass = BADGE_CLASSES[badgeVariant] ?? BADGE_CLASSES['trend-up'];
  const tint = CARD_TINTS[accent] ?? '';

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`chat-stat-card ${tint}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={well}>
          <MaterialIcon name={icon} fill={iconFill} />
        </div>
        {badge &&
          (badgeVariant === 'trend-up' || badgeVariant === 'trend-down' ? (
            <StatusBadge variant={badgeVariant}>{badge}</StatusBadge>
          ) : (
            <span className={badgeClass}>{badge}</span>
          ))}
      </div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
      <h4 className="text-3xl font-black tracking-tight text-on-surface leading-tight">{value}</h4>
      <ChatStatFooter footer={footer} />
    </motion.article>
  );
}
