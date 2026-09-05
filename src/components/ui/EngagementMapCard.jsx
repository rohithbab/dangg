import { motion } from 'framer-motion';

const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMZ2dJAffU8by1Uj_5u8nWB-87QokZ5ojzxMCTTjTTsEQ23peh73WUR4Wp229yAsyEcuHkOgDFHG-Kq4VI-XQ0U2XC0RHIbLBKwGgUhVldWNhG7xQqls6ZKuNlLUm-JZejtMz5XnqewcjCRzZ-xo7-EyPROjJM69NjH3A1CfFGA49Pb0rNmsGiUl0xqc3paOcODYdw4WJg8Ijxq42Hk1FLez5BPmnDOW6G8_rpliti-vHiG3TxOtlbm__Gnox05DLrM1xN_sUohPI';

function NetworkMapGraphic() {
  return (
    <svg
      className="fill-current text-ember opacity-20"
      height="400"
      width="400"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <motion.circle 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="0.5" 
      />
      <motion.circle 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.5" 
      />
      <motion.circle 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
        cx="50" cy="50" fill="none" r="20" stroke="currentColor" strokeWidth="0.5" 
      />
      <motion.circle 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.8 }}
        cx="30" cy="30" r="2" 
      />
      <motion.circle 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1.0 }}
        cx="70" cy="70" r="3" 
      />
      <motion.circle 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1.2 }}
        cx="20" cy="60" r="1.5" 
      />
      <motion.circle 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1.4 }}
        cx="80" cy="40" r="2" 
      />
    </svg>
  );
}

export function EngagementMapCard({
  title = 'Network Engagement Map',
  description = 'Regional distribution of active chat sessions across global clusters.',
  activeLabel = 'Active: 142 Nodes',
  idleLabel = 'Idle: 12 Nodes',
}) {
  return (
    <article className="card card-pad-lg relative overflow-hidden">
      <div className="relative z-10">
        <h5 className="type-headline-md mb-2 text-ink">{title}</h5>
        <p className="type-body-md mb-6 normal-case">{description}</p>
        <div className="flex flex-wrap gap-4">
          <span className="map-badge-active">{activeLabel}</span>
          <span className="map-badge-idle">{idleLabel}</span>
        </div>
      </div>
      <div className="pointer-events-none absolute right-[-40px] top-[-40px] opacity-20">
        <NetworkMapGraphic />
      </div>
      <img
        src={MAP_IMAGE}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay"
      />
    </article>
  );
}
