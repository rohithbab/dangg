export function SectionTitle({ title, children, className = '' }) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`.trim()}>
      <div className="h-5 w-[3px] rounded-full bg-primary" />
      <h3 className="font-display text-sm font-black uppercase tracking-[0.14em] text-on-surface">
        {title || children}
      </h3>
    </div>
  );
}
