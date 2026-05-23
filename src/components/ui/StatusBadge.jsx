const VARIANTS = {
  'trend-up': 'badge-trend-up',
  'trend-down': 'badge-trend-down',
  stable: 'badge-status-stable',
  growing: 'badge-status-growing',
  health: 'flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded',
  pending: 'badge-payout-pending',
  approved: 'badge-payout-approved',
  completed: 'badge-payout-completed',
  rejected: 'badge-payout-rejected',
  processing: 'badge-payout-processing',
  male: 'badge-gender-male',
  female: 'badge-gender-female',
  active: 'badge-status-active',
  offline: 'badge-status-offline',
  busy: 'badge-status-busy',
  suspended: 'badge-status-suspended',
  resolved: 'badge-transcript-resolved',
  escalated: 'badge-transcript-escalated',
  archived: 'badge-transcript-archived',
};

export function StatusBadge({ variant, children, icon, showDot, size = 'md' }) {
  const className = `${VARIANTS[variant] ?? VARIANTS['trend-up']} ${size === 'sm' ? '!px-2 !py-0.5 !text-[10px]' : ''}`.trim();
  
  const renderDot = () => {
    switch (variant) {
      case 'active': return <span className="status-dot-pulse-emerald" />;
      case 'busy': return <span className="status-dot-amber" />;
      case 'offline': return <span className="status-dot-gray" />;
      case 'suspended': return <span className="status-dot-red" />;
      default: return null;
    }
  };
  
  const hasDot = ['active', 'busy', 'offline', 'suspended'].includes(variant) || showDot;

  if (hasDot) {
    return (
      <span className={className}>
        {renderDot()}
        {icon}
        {children}
      </span>
    );
  }

  if (variant === 'health') {
    return (
      <span className={className}>
        {icon}
        {children}
      </span>
    );
  }
  return <span className={className}>{children}</span>;
}
