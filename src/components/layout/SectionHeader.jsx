export function SectionHeader({ title, children, className = '' }) {
  return (
    <div className={`mb-5 flex items-center justify-between ${className}`.trim()}>
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        {title}
      </h3>
      {children}
    </div>
  );
}
