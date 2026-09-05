import { motion, useReducedMotion } from 'framer-motion';
import { createContext } from 'react';
import { EASE } from './easing';

/**
 * MOTION PRIMITIVES — "Warm Signal"
 *
 * The choreography from the reference: the page does not pop in all at once.
 * It cascades — canvas settles, then cards rise in reading order, then the
 * numbers count and the charts draw. Roughly 1.4s from first paint to rest.
 *
 * Every primitive respects prefers-reduced-motion by collapsing to a plain
 * opacity fade (or nothing), because motion here is emphasis, never meaning.
 */


const StaggerCtx = createContext(0);

/* ── Stagger group ────────────────────────────────────────────────────────
   Wrap a row/grid; children reveal in sequence rather than together. */
export function Stagger({ children, className, delay = 0, gap = 0.06 }) {
  const reduce = useReducedMotion();
  return (
    <StaggerCtx.Provider value={gap}>
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: reduce
              ? { staggerChildren: 0, delayChildren: 0 }
              : { staggerChildren: gap, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    </StaggerCtx.Provider>
  );
}

/* ── Reveal ───────────────────────────────────────────────────────────────
   A single card entering. Rises 14px and settles. Inside a <Stagger> the
   timing is inherited, so no manual delay math per card. */
export function Reveal({ children, className, y = 14, duration = 0.55, delay }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: reduce ? 0.2 : duration, ease: EASE, delay },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/* ── Hover lift ───────────────────────────────────────────────────────────
   Interactive cards float toward the cursor. Spring, not tween — a lift that
   tracks the pointer should feel physical. */
export function Lift({ children, className, amount = -4, scale = 1.008, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} {...rest}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={{ y: amount, scale }}
      whileTap={{ y: amount / 2, scale: 0.997 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.7 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ── Draw-on ──────────────────────────────────────────────────────────────
   Reveals a chart by wiping it open left-to-right (or bottom-up for bars),
   which reads as the chart "drawing itself" without animating every datum. */
export function DrawIn({ children, className, direction = 'left', duration = 1.05, delay = 0.15 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const origin = direction === 'up' ? 'bottom' : 'left';
  const axis = direction === 'up' ? 'scaleY' : 'scaleX';

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin }}
      initial={{ [axis]: 0, opacity: 0.4 }}
      animate={{ [axis]: 1, opacity: 1 }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Pop ──────────────────────────────────────────────────────────────────
   For badges/tooltips that appear on top of data. */
export function Pop({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 520, damping: 30, delay }}
    >
      {children}
    </motion.div>
  );
}

