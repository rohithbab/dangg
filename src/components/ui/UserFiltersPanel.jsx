import { FilterTabBar } from './FilterTabBar';
import { SearchField } from './SearchField';
import { MaterialIcon } from './MaterialIcon';

const DEFAULT_TABS = [
  { id: 'all', label: 'All', count: 850 },
  { id: 'male', label: 'Male', count: 450 },
  { id: 'female', label: 'Female', count: 400 },
];

export function UserFiltersPanel({ 
  tabs = DEFAULT_TABS, 
  activeTab = 'all', 
  onTabChange,
  searchQuery,
  onSearchChange,
  filters = {},
  onFilterChange,
  onReset,
  sort,
  onSortChange,
}) {
  return (
    <section className="filter-panel space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterTabBar tabs={tabs} activeId={activeTab} onChange={onTabChange} />
        
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={onReset}
            className="btn-toolbar flex items-center gap-2 text-error hover:bg-error/10"
          >
            <MaterialIcon name="restart_alt" className="!text-[18px]" />
            <span>Reset</span>
          </button>
          
          <div className="relative min-w-[200px]">
            <select 
              className="input-field py-2 pr-10 appearance-none bg-white"
              value={`${sort?.field}-${sort?.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                onSortChange?.(field, direction);
              }}
            >
              <option value="lastActive-desc">Recently Active</option>
              <option value="joinDate-desc">Newest Users</option>
              <option value="earnings-desc">Highest Earnings</option>
              <option value="totalChats-desc">Most Chats</option>
              <option value="name-asc">Alphabetical A-Z</option>
              <option value="verified-desc">Verified Users</option>
            </select>
            <MaterialIcon name="sort" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
        </div>
      </div>

      <SearchField 
        placeholder="Search users by name, email, phone or ID..." 
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="filter-field-label" htmlFor="status-filter">
            Status
          </label>
          <select 
            id="status-filter"
            className="input-field bg-white"
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange?.('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Online/Offline Filter */}
        <div className="space-y-2">
          <label className="filter-field-label" htmlFor="online-filter">
            Presence
          </label>
          <select 
            id="online-filter"
            className="input-field bg-white"
            value={filters.onlineStatus || 'all'}
            onChange={(e) => onFilterChange?.('onlineStatus', e.target.value)}
          >
            <option value="all">All Presence</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Age Range Filter */}
        <div className="space-y-2">
          <span className="filter-field-label">Age Range</span>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="input-field py-2"
              placeholder="From"
              value={filters.ageRange?.min || ''}
              onChange={(e) => onFilterChange?.('ageRange', { ...filters.ageRange, min: e.target.value })}
            />
            <span className="text-outline text-sm">to</span>
            <input
              type="number"
              className="input-field py-2"
              placeholder="To"
              value={filters.ageRange?.max || ''}
              onChange={(e) => onFilterChange?.('ageRange', { ...filters.ageRange, max: e.target.value })}
            />
          </div>
        </div>

        {/* Earnings Range Filter */}
        <div className="space-y-2">
          <span className="filter-field-label">Earnings (₹)</span>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="input-field py-2"
              placeholder="Min"
              value={filters.earningsRange?.min || ''}
              onChange={(e) => onFilterChange?.('earningsRange', { ...filters.earningsRange, min: e.target.value })}
            />
            <span className="text-outline text-sm">to</span>
            <input
              type="number"
              className="input-field py-2"
              placeholder="Max"
              value={filters.earningsRange?.max || ''}
              onChange={(e) => onFilterChange?.('earningsRange', { ...filters.earningsRange, max: e.target.value })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
