import { motion } from 'framer-motion';
import { IconWell } from './IconWell';
import { AnimatedCounter } from '../animation';

export function DemographicCard({ icon, label, value, accent = 'primary' }) {
  return (
    <motion.article 
      whileHover={{ scale: 1.05, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card-interactive card-pad text-center transition-all h-full flex flex-col items-center justify-center"
    >
      <IconWell icon={icon} accent={accent} rounded="full" className="mb-4" />
      <h5 className="type-display text-on-surface">
        <AnimatedCounter value={value} />
      </h5>
      <p className="type-label-md mt-2 tracking-wider">{label}</p>
    </motion.article>
  );
}
