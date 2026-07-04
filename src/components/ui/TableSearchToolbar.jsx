import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';

export function TableSearchToolbar({
  searchPlaceholder = 'Search users...',
  filterLabel = 'Filter',
  searchQuery,
  onSearchChange,
  onFilterClick,
  onReset,
  showReset,
  hideLegacyFilter = false,
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <motion.div
        initial={false}
        className="relative w-full sm:w-auto min-w-[200px]"
      >
        <MaterialIcon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          size="sm"
        />
        <input
          type="search"
          className="input-search"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </motion.div>
      {!hideLegacyFilter && (
      <motion.button
        whileHover={{ backgroundColor: 'var(--surface-container-highest)' }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="btn-toolbar"
        onClick={onFilterClick}
      >
        <MaterialIcon name="filter_list" className="text-[18px]" />
        <span className="type-body-md normal-case text-on-surface">{filterLabel}</span>
      </motion.button>
      )}
      
      {showReset && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ backgroundColor: 'var(--error-container)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="btn-toolbar text-error border-error/20"
        >
          <MaterialIcon name="restart_alt" className="!text-[18px]" />
          <span>Reset</span>
        </motion.button>
      )}
    </div>
  );
}
