import { MaterialIcon } from './MaterialIcon';

export function SectionHeading({ icon, title, className = '' }) {
  return (
    <div className={`mb-4 flex items-center gap-2 ${className}`.trim()}>
      <MaterialIcon name={icon} className="text-ember" />
      <h3 className="type-headline-md text-ink">{title}</h3>
    </div>
  );
}
