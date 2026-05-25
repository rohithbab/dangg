import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { UserIdentityCell } from '../components/ui/UserIdentityCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { MOCK_USERS } from '../data/userProfiles';
import { useFilteredData } from '../hooks/useFilteredData';

const TABLE_COLUMNS = ['User', 'Gender', 'Join Date', 'Age', 'View'];

export function UserManagementPage() {
  const [showFilters, setShowFilters] = useState(false);

  // New robust filtering hook
  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(MOCK_USERS, {
    searchFields: ['name', 'id', 'gender', 'email', 'phone'],
    initialFilters: {
      id: '',
      userName: '',
      gender: '',
      ageRange: '',
      accountStatus: '',
    },
  });

  // Unique options for dropdowns
  const options = useMemo(() => ({
    userIds: [...new Set(MOCK_USERS.map(u => u.id))].sort(),
    userNames: [...new Set(MOCK_USERS.map(u => u.name))].sort(),
    genders: ['All', 'male', 'female'],
    ageRanges: ['18-24', '25-30', '31-40', '40+'],
    statuses: ['Active', 'Verified', 'Premium', 'Suspended', 'Offline'],
  }), []);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-2xl mx-auto md:mx-0">
            <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 !text-[24px]" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm text-body-lg"
              placeholder="Search users by name, ID, gender, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            <MaterialIcon name="tune" className="!text-[20px]" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse border-2 border-white" />
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <FilterPanel isOpen={showFilters} onReset={resetFilters}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SearchableSelect
              label="User ID"
              options={options.userIds}
              value={filters.id}
              onChange={(val) => updateFilter('id', val)}
              placeholder="Any ID"
              icon="tag"
            />
            <SearchableSelect
              label="User Name"
              options={options.userNames}
              value={filters.userName}
              onChange={(val) => updateFilter('userName', val)}
              placeholder="Any Name"
              icon="person"
            />
            <SearchableSelect
              label="Gender"
              options={options.genders}
              value={filters.gender}
              onChange={(val) => updateFilter('gender', val)}
              placeholder="Both Genders"
              icon="wc"
            />
            <SearchableSelect
              label="Age Range"
              options={options.ageRanges}
              value={filters.ageRange}
              onChange={(val) => updateFilter('ageRange', val)}
              placeholder="All Ages"
              icon="cake"
            />
            <SearchableSelect
              label="Account Status"
              options={options.statuses}
              value={filters.accountStatus}
              onChange={(val) => updateFilter('accountStatus', val)}
              placeholder="All Status"
              icon="verified_user"
            />
          </div>
        </FilterPanel>

        {/* Table Section */}
        <div className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col} className={`px-8 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant ${col === 'View' ? 'text-center' : ''}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                <AnimatePresence>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((user) => {
                      const profilePath = user.gender === 'male' ? `/users/male/${user.id}` : `/users/female/${user.id}`;
                      return (
                        <motion.tr 
                          key={user.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="hover:bg-surface-container-low transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <Link to={profilePath} className="block w-max hover:opacity-70 transition-opacity">
                              <UserIdentityCell
                                initials={user.initials}
                                name={user.name}
                                email={user.email}
                                avatarVariant={user.avatarVariant}
                              />
                            </Link>
                          </td>
                          <td className="px-8 py-5">
                            <StatusBadge variant={user.gender}>
                              {user.gender === 'male' ? 'Male' : 'Female'}
                            </StatusBadge>
                          </td>
                          <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                            {user.joinDate}
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-on-surface">
                            {user.age}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <Link
                              to={profilePath}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                            >
                              <MaterialIcon name="visibility" className="!text-[20px]" />
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <motion.tr key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan={TABLE_COLUMNS.length} className="py-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
                            <MaterialIcon name="person_off" className="!text-[40px] text-on-surface-variant/20" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-on-surface">No users found</p>
                            <p className="text-sm text-on-surface-variant">Try searching for a different name, ID or gender</p>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
