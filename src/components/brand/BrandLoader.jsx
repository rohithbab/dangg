import { motion, useReducedMotion } from 'framer-motion';
import { PlaneMark } from './Logo';
import { BRAND_PINK } from './tokens';

/**
 * BRAND LOADER
 *
 * The mark is a paper plane, so the loading motion is flight: the plane lifts
 * and banks gently while a vapour trail sweeps beneath it and a soft pink halo
 * breathes behind. It reads as "in transit", which is what loading actually is.
 *
 * Pink appears here because this is the brand moment — the surrounding UI keeps
 * its ember accent, so the two never compete inside a data view.
 *
 * Under prefers-reduced-motion everything holds still and only the trail
 * animates as a plain opacity pulse.
 */
export function BrandLoader({ size = 64, label = 'Loading', className = '' }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative grid place-items-center" style={{ width: size * 2, height: size * 1.6 }}>
        {/* Breathing halo */}
        <motion.span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: size * 1.5,
            height: size * 1.5,
            background: `radial-gradient(circle, ${BRAND_PINK}44 0%, transparent 70%)`,
          }}
          animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Vapour trail — three dashes sweeping past, back to front */}
        {!reduce && [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              height: 2,
              width: size * 0.42,
              background: `linear-gradient(90deg, transparent, ${BRAND_PINK})`,
              top: size * 0.5 + i * (size * 0.22),
            }}
            initial={{ x: size * 0.9, opacity: 0 }}
            animate={{ x: -size * 1.1, opacity: [0, 0.9, 0] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: 'easeIn',
              delay: i * 0.22,
            }}
          />
        ))}

        {/* The plane itself — lifts and banks */}
        <motion.div
          className="relative"
          animate={
            reduce
              ? undefined
              : { y: [0, -size * 0.11, 0], rotate: [-5, 5, -5] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="grid place-items-center rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 34% 28%, #FF8FD4 0%, ${BRAND_PINK} 48%, #E0409E 100%)`,
              boxShadow: `0 10px 28px -8px ${BRAND_PINK}cc, inset 0 1px 2px rgba(255,255,255,.45)`,
            }}
          >
            <PlaneMark size={size * 0.56} />
          </span>
        </motion.div>
      </div>

      {label && (
        <p className="text-label uppercase tracking-[0.18em] text-ink-3">{label}</p>
      )}
      <span className="sr-only">{label}…</span>
    </div>
  );
}

/**
 * Full-page variant, used as the route-level Suspense fallback while a lazy
 * page chunk downloads.
 */
export function BrandPageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <BrandLoader label={label} />
    </div>
  );
}
