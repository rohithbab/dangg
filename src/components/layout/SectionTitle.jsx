export function SectionTitle({ title, children, className = '' }) {
  return (
    <h3 className={`mb-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${className}`.trim()}>
      {title || children}
    </h3>
  );
}
