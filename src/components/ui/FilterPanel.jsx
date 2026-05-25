import { motion, AnimatePresence } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';

export function FilterPanel({ 
  isOpen, 
  onReset, 
  children, 
  className = "" 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`z-40 ${className}`}
          style={{ overflow: isOpen ? 'visible' : 'hidden' }}
        >
          <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-sm space-y-8">
            {/* Filter Controls Slot */}
            <div className="w-full">
              {children}
            </div>
            
            {/* Bottom Reset Section */}
            <div className="flex pt-6 border-t border-outline-variant/50">
              <button 
                onClick={onReset} 
                className="text-error font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-error/10 px-4 py-2.5 rounded-xl transition-all"
              >
                <MaterialIcon name="restart_alt" size="sm" />
                Reset All Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
