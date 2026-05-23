export function SectionTitle({ title, children, className = '' }) {
  return (
    <h3 className={`type-headline-lg mb-6 text-on-surface ${className}`.trim()}>
      {title || children}
    </h3>
  );
}
