export function FeatureCard({ title, description, actionLabel, onAction }) {
  return (
    <article className="card-feature relative overflow-hidden">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/8" />
        <div className="absolute -left-4 -bottom-12 h-32 w-32 rounded-full bg-primary/5" />
        <div className="absolute right-32 bottom-0 h-px w-40 bg-gradient-to-r from-transparent via-on-sidebar-muted/20 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary/15 px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Live Insights
            </span>
          </div>
          <h4 className="text-xl font-black tracking-tight text-on-sidebar mb-2">{title}</h4>
          <p className="card-feature-copy text-sm leading-relaxed">{description}</p>
        </div>
        <button
          type="button"
          className="shrink-0 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-accent-glow transition-all hover:bg-primary-container active:scale-95 md:self-center"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
