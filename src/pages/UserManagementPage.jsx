import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { UserFiltersPanel } from '../components/ui/UserFiltersPanel';
import { UserIdentityCell } from '../components/ui/UserIdentityCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { TablePaginationFull } from '../components/ui/TablePaginationFull';
import { MOCK_USERS } from '../data/userProfiles';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';
import { useDataFilter } from '../hooks/useDataFilter';

const TABLE_COLUMNS = ['User', 'Gender', 'Join Date', 'Age', 'View'];

export function UserManagementPage() {
  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    sort,
    updateSort,
    resetFilters,
  } = useDataFilter(MOCK_USERS, {
    searchFields: ['name', 'email', 'id', 'phone'],
    initialFilters: { gender: 'all', status: 'all', onlineStatus: 'all' },
    initialSort: { field: 'joinDate', direction: 'desc' },
  });

  const handleTabChange = (tabId) => {
    updateFilter('gender', tabId);
  };

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-8">
        <AnimatedCardEntrance delay={0}>
          <UserFiltersPanel 
            activeTab={filters.gender}
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            sort={sort}
            onSortChange={updateSort}
          />
        </AnimatedCardEntrance>

        <AnimatedCardEntrance delay={0.2}>
          <section className="table-shell">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="table-head">
                    {TABLE_COLUMNS.map((col) => (
                      <th
                         key={col}
                         className={`px-6 py-4 font-semibold uppercase tracking-wider ${
                           col === 'View' ? 'text-center' : ''
                         }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <AnimatePresence>
                    {filteredData.length > 0 ? (
                      filteredData.map((user) => {
                        const profilePath = user.gender === 'male' ? `/users/male/${user.id}` : `/users/female/${user.id}`;
                        return (
                          <motion.tr 
                            key={user.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ backgroundColor: 'var(--surface-container-low)' }}
                            className="table-row"
                          >
                            <td className="px-6 py-4">
                              <Link
                                to={profilePath}
                                className="hover:opacity-80 transition-opacity block w-max"
                                aria-label={`View ${user.name} profile`}
                              >
                                <UserIdentityCell
                                  initials={user.initials}
                                  name={user.name}
                                  email={user.email}
                                  avatarVariant={user.avatarVariant}
                                />
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge variant={user.gender}>
                                {user.gender === 'male' ? 'Male' : 'Female'}
                              </StatusBadge>
                            </td>
                            <td className="type-body-md px-6 py-4 normal-case text-on-surface-variant">
                              {user.joinDate}
                            </td>
                            <td className="type-body-md px-6 py-4 font-medium normal-case text-on-surface">
                              {user.age}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Link
                                to={profilePath}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-all duration-200 outline-none"
                                aria-label={`View ${user.name} profile`}
                              >
                                <MaterialIcon name="visibility" className="!text-[20px]" />
                              </Link>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-64"
                      >
                        <td colSpan={TABLE_COLUMNS.length} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                            <MaterialIcon name="search_off" className="!text-[48px] opacity-20" />
                            <p className="type-title-md">No users found</p>
                            <p className="type-body-md">Try adjusting your filters or search query</p>
                            <button 
                              onClick={resetFilters}
                              className="mt-4 btn-secondary-outline"
                            >
                              Clear all filters
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </section>
        </AnimatedCardEntrance>
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
