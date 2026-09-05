import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * LOADING — "converging on the answer"
 *
 * A loading figure here is not noise and not a grey box. It counts: digits
 * settle LEFT-TO-RIGHT, the way a mechanical counter locks in, so the number
 * visibly stabilises instead of flickering until it pops. By the time real data
 * lands, most of the figure has already stopped moving.
 *
 * Why this over a scramble: pure random digits read as "broken", and a grey
 * block reads as "nothing is happening". A converging counter reads as work in
 * progress — which is the truth.
 *
 * Everything degrades to a static dash under prefers-reduced-motion.
 */

const DIGITS = '0123456789';
const randDigit = () => DIGITS[(Math.random() * 10) | 0];

/**
 * `sample` is a shape template: its digits animate, everything else (commas,
 * decimal points, ₹, %) is fixed. Pass the shape the real value will have so
 * the placeholder is exactly the same width — e.g. "₹00,000" or "0.00".
 */
export function ValuePlaceholder({ chars = 5, sample, className = '' }) {
  const reduce = useReducedMotion();
  const template = sample ?? '0'.repeat(Math.max(1, chars));
  const [text, setText] = useState(template);

  useEffect(() => {
    if (reduce) return;

    const slots = [];
    for (let i = 0; i < template.length; i++) {
      if (/\d/.test(template[i])) slots.push(i);
    }
    if (!slots.length) return;

    /* Each digit locks in at a staggered time — left to right. The value it
       locks TO is decided once, up front, so a settled digit never moves
       again however long the request takes. */
    const LOCK_STEP = 190;
    const lockAt = slots.map((_, k) => 420 + k * LOCK_STEP);
    const lockTo = slots.map(() => randDigit());

    let raf;
    let start = 0;
    let last = 0;

    const tick = (t) => {
      if (!start) start = t;
      const age = t - start;

      if (t - last > 55) {
        const chars = template.split('');
        slots.forEach((slotIdx, k) => {
          chars[slotIdx] = age > lockAt[k] ? lockTo[k] : randDigit();
        });
        setText(chars.join(''));
        last = t;
      }

      /* Once every digit has settled there is nothing left to animate — stop
         the loop rather than burn frames until the data arrives. */
      if (age > lockAt[lockAt.length - 1] + 80) return;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, template]);

  if (reduce) {
    return (
      <span className={`tabular text-ink-3 ${className}`} aria-hidden="true">
        {template.replace(/\d/g, '–')}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`tabular text-ink-3 ${className}`}
      style={{ opacity: 0.38 }}
    >
      {text}
    </span>
  );
}

/** Inline label/caption placeholder — a travelling-highlight bar. */
export function TextPlaceholder({ w = '7ch', className = '' }) {
  const reduce = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[0.85em] rounded-[4px] align-middle ${
        reduce ? 'bg-canvas-sunk' : 'shimmer-bar'
      } ${className}`}
      style={{ width: w }}
    />
  );
}

/**
 * A loading track. Instead of a 0%-wide bar or a looping sweep that never
 * arrives, the fill GROWS toward a plausible resting width and breathes there —
 * so the row previews its own shape while it waits.
 */
export function TrackPlaceholder({ className = '', width = 46, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <div className={`track ${className}`} aria-hidden="true">
      {!reduce && (
        <motion.div
          className="h-full rounded-pill"
          style={{
            background:
              'linear-gradient(90deg, rgba(232,81,31,0.30), rgba(232,81,31,0.55))',
          }}
          initial={{ width: '4%' }}
          animate={{ width: [`${width * 0.55}%`, `${width}%`, `${width * 0.72}%`] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay,
          }}
        />
      )}
    </div>
  );
}

/**
 * Top-of-viewport progress line. Eases toward 90% while work is in flight —
 * never completing on its own, because it does not know when the data lands —
 * then snaps to 100% and fades once it does.
 */
export function LoadingBar({ active }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Two chained tweens: a quick dash to 65%, then a long patient
              crawl to 92%. It never reaches 100% on its own because it cannot
              know when the data lands — it simply fades out when it does. */}
          <motion.div
            className="h-full origin-left rounded-r-pill"
            style={{
              background: 'linear-gradient(90deg, #E8511F, #F8794B)',
              boxShadow: '0 0 12px rgba(232,81,31,0.55)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '65%', '92%'] }}
            transition={{ duration: 9, times: [0, 0.18, 1], ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Single polite announcement of load state for assistive tech. */
export function LoadingRegion({ loading, label = 'Loading dashboard data' }) {
  return (
    <span className="sr-only" role="status" aria-live="polite">
      {loading ? label : 'Data loaded'}
    </span>
  );
}
