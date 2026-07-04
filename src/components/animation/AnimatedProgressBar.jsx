import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Animate a progress bar from 0 to its target percentage.
 */
export function AnimatedProgressBar({ 
  value, 
  color = 'primary', 
  size = 'sm', 
  className = "" 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const heightClass = size === 'lg' ? 'h-2' : size === 'md' ? 'h-1.5' : 'h-1';
  const colorClass =
    color === 'secondary' ? 'bg-secondary' :
    color === 'tertiary' ? 'bg-tertiary' :
    color === 'error' ? 'bg-error' : 'bg-on-surface';

  return (
    <div ref={ref} className={`progress-track overflow-hidden bg-surface-container-high ${heightClass} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
}
