import { MaterialIcon } from './MaterialIcon';

const ICON_TONES = {
  star: 'text-amber-500',
  thumb_up: 'text-emerald-600',
  thumb_down: 'text-critical',
  favorite: 'text-rose-600',
};

export function RatingStatCard({ icon, value, label, fill = false }) {
  const tone = ICON_TONES[icon] ?? 'text-ember';

  return (
    <article className="rating-stat-card">
      <MaterialIcon name={icon} fill={fill} className={`mb-2 ${tone}`} />
      <p className="type-headline-md text-ink">{value}</p>
      <p className="font-label-sm text-label-sm normal-case text-ink-2">{label}</p>
    </article>
  );
}
