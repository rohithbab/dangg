import { MaterialIcon } from './MaterialIcon';

const ICON_WELLS = {
  primary: 'chat-metric-icon-well-primary',
  secondary: 'chat-metric-icon-well-secondary',
};

export function ChatMetricCard({ icon, label, value, accent = 'primary' }) {
  const well = ICON_WELLS[accent] ?? ICON_WELLS.primary;

  return (
    <article className="chat-metric-card">
      <div className={well}>
        <MaterialIcon name={icon} className="text-3xl" />
      </div>
      <div>
        <p className="font-label-sm text-label-sm normal-case text-ink-2">{label}</p>
        <p className="type-display">{value}</p>
      </div>
    </article>
  );
}
