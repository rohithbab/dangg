import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';

export function SearchableSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const filteredOptions = options.filter(opt =>
    String(opt).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    // If "All" is selected or the same option is selected again, clear the filter
    if (option === 'All' || option === value) {
      onChange('');
    } else {
      onChange(option);
    }
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 bg-white border rounded-2xl transition-all text-left ${
            isOpen ? 'border-primary ring-4 ring-primary/10 shadow-sm' : 'border-outline-variant hover:border-outline'
          } ${value ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}
        >
          {icon && <MaterialIcon name={icon} className={`!text-[20px] ${value ? 'text-primary' : 'text-outline'}`} />}
          <span className="flex-1 truncate">{value || placeholder}</span>
          <MaterialIcon 
            name={isOpen ? 'expand_less' : 'expand_more'} 
            className={`transition-transform duration-300 ${isOpen ? 'text-primary' : 'text-outline'}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-[100] left-0 right-0 mt-2 bg-white border border-outline-variant rounded-2xl shadow-2xl overflow-hidden min-w-[200px]"
            >
              <div className="p-3 border-b border-outline-variant bg-surface-container-lowest">
                <div className="relative">
                  <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[18px]" />
                  <input
                    type="text"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="Search options..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar scroll-smooth">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full px-4 py-2.5 text-sm font-bold text-left transition-colors flex items-center justify-between group ${
                        option === value 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="capitalize">{option}</span>
                      {option === value && <MaterialIcon name="check" className="!text-[18px]" />}
                      {option !== value && (
                        <MaterialIcon name="chevron_right" className="!text-[16px] opacity-0 group-hover:opacity-100 transition-opacity text-outline" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <MaterialIcon name="search_off" className="text-outline/30 !text-[32px] mb-2" />
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">No options found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
