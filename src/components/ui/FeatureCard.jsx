import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';

export function FeatureCard({ title, description, actionLabel, onAction }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-canvas-sunk border border-sidebar-border p-6 shadow-card-lift"
    >
      {/* Background glow blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: '-5%', top: '-20%',
          width: '35%', height: '80%',
          background: 'radial-gradient(ellipse, rgba(200,245,0,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-ember/15 px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ember">
              Live Insights
            </span>
          </div>
          <h4 className="font-display text-xl font-black tracking-tight text-ink mb-1.5">
            {title}
          </h4>
          <p className="text-sm text-ink-3 leading-relaxed max-w-prose">
            {description}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="shrink-0 self-start rounded-xl bg-ember px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 md:self-center"
          onClick={onAction}
        >
          {actionLabel}
        </motion.button>
      </div>
    </motion.article>
  );
}
