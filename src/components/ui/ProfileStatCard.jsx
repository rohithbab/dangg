import { MaterialIcon } from './MaterialIcon';
import { formatCurrency } from '../../utils/formatters';

const ICON_WELLS = {
  primary: 'profile-stat-icon-well-primary',
  secondary: 'profile-stat-icon-well-secondary',
  tertiary: 'profile-stat-icon-well-tertiary',
  neutral: 'profile-stat-icon-well-neutral',
  accent: 'profile-stat-icon-well-accent',
};

export function ProfileStatCard({ label, value, icon, accent = 'neutral', trend }) {
  const well = ICON_WELLS[accent] ?? ICON_WELLS.neutral;

  const formattedValue = typeof value === 'number' || (typeof value === 'string' && (value.startsWith('₹') || value.startsWith('$')))
    ? formatCurrency(value)
    : value;

  return (
    <article className="profile-stat-card">
      <div className="flex items-start justify-between">
        <div className={well}>
          <MaterialIcon name={icon} fill={icon === 'favorite'} />
        </div>
        {trend && <span className="badge-trend-up flex items-center">{trend}</span>}
      </div>
      <div className="mt-4">
        <p className="type-label-md normal-case">{label}</p>
        <p className="type-headline-lg text-ink">{formattedValue}</p>
      </div>
    </article>
  );
}
