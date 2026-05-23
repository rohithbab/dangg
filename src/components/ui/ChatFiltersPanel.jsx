import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';

export function ChatFiltersPanel({
  filters,
  onFilterChange,
  onReset,
  statusOptions = ['Resolved', 'Escalated', 'Archived'],
  showStatusFilter = true,
  showChatIdFilter = false,
  showDateFilter = true,
}) {
  const [showCustomDate, setShowCustomDate] = useState(filters.dateRange?.type === 'custom');

  const handleDateTypeChange = (type) => {
    if (type === 'custom') {
      setShowCustomDate(true);
      onFilterChange('dateRange', { ...filters.dateRange, type: 'custom' });
    } else {
      setShowCustomDate(false);
      onFilterChange('dateRange', { type });
    }
  };

  return (
    <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="type-title-md text-on-surface flex items-center gap-2">
          <MaterialIcon name="tune" className="text-primary" />
          Advanced Filters
        </h3>
        <button
          onClick={onReset}
          className="text-error font-semibold text-sm hover:underline flex items-center gap-1"
        >
          <MaterialIcon name="restart_alt" size="sm" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range Dropdown */}
        {showDateFilter && (
          <div className="space-y-2">
            <label className="filter-field-label">Date Range</label>
            <div className="relative">
              <select
                className="input-field input-field-icon appearance-none bg-white"
                value={filters.dateRange?.type || 'all'}
                onChange={(e) => handleDateTypeChange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              <MaterialIcon
                name="calendar_today"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Status Filter */}
        {showStatusFilter && (
          <div className="space-y-2">
            <label className="filter-field-label">Status</label>
            <div className="relative">
              <select
                className="input-field input-field-icon appearance-none bg-white"
                value={filters.status || 'All'}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <option value="All">All Status</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <MaterialIcon
                name="info"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Chat ID Filter */}
        {showChatIdFilter && (
          <div className="space-y-2">
            <label className="filter-field-label">Quick Chat ID Match</label>
            <div className="relative">
              <input
                type="text"
                className="input-field input-field-icon bg-white"
                placeholder="Enter exact or partial ID..."
                value={filters.id || ''}
                onChange={(e) => onFilterChange('id', e.target.value)}
              />
              <MaterialIcon
                name="tag"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                size="sm"
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCustomDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/50">
              <div className="space-y-2">
                <label className="filter-field-label">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="filter-field-label">End Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
