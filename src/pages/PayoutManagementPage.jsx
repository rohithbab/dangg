import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { RevenueMetricCard } from '../components/ui/RevenueMetricCard';
import { DistributionCard } from '../components/ui/DistributionCard';
import { AdminTableCard } from '../components/ui/AdminTableCard';
import { TableSearchToolbar } from '../components/ui/TableSearchToolbar';
import { TablePagination } from '../components/ui/TablePagination';
import { TableUserCell } from '../components/ui/TableUserCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useFilteredData } from '../hooks/useFilteredData';

const PAYOUT_STATS = [
  {
    label: 'Total Requests',
    value: '45',
    icon: 'list_alt',
    accent: 'primary',
    badge: (
      <span className="badge-trend-up flex items-center gap-1">
        <MaterialIcon name="trending_up" size="sm" />
        +8% from last month
      </span>
    ),
  },
  {
    label: 'Pending',
    value: '12',
    icon: 'pending',
    accent: 'tertiary',
    badge: <span className="badge-neutral">Awaiting approval</span>,
  },
  {
    label: 'Completed',
    value: '25',
    icon: 'check_circle',
    accent: 'secondary',
    badge: (
      <span className="badge-trend-up flex items-center gap-1">
        <MaterialIcon name="verified" size="sm" />
        Payout successful
      </span>
    ),
  },
  {
    label: 'Rejected',
    value: '5',
    icon: 'cancel',
    accent: 'error',
    badge: <span className="font-label-sm text-label-sm normal-case text-error">Validation failed</span>,
  },
  {
    label: 'Processing',
    value: '3',
    icon: 'sync',
    accent: 'secondary',
    badge: <span className="badge-neutral">In transit</span>,
  },
];

const DISTRIBUTION_SEGMENTS = [
  { id: 'pending', label: 'Pending', percent: 26.6, percentLabel: '26%', showLabel: true },
  { id: 'completed', label: 'Completed', percent: 55.6, percentLabel: '56%', showLabel: true },
  { id: 'rejected', label: 'Rejected', percent: 11.1, percentLabel: '11%', showLabel: true },
  { id: 'processing', label: 'Processing', percent: 6.7, percentLabel: '7%', showLabel: true },
];

const TABLE_COLUMNS = [
  'User ID',
  'User Name',
  'Amount',
  'Status',
  'UPI ID',
  'Requested Date',
  'Actions',
];

const PAYOUT_REQUESTS = [
  {
    id: 'PYT-8821',
    userId: 'USR-1001',
    name: 'Rahul Verma',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAX0-O-jW-OeXAhyb9XC4wS7JThRxaGjHvkHdGfwnSF4XzYp7g8o3Qk_gyHaGgGJc4PlLCnCH-cbR7YmGyQVB3VMbc_RpOEypAN7MZCgNmgk1csrFKhqXFm7YB64uYLwjFyto6t_If_NB4q2a8STH3BoI8Thk-MV6VMy4sG7MlkpltJAcV9TQlBWSBMdV59SUGNMKtC3mY_uh_x8ExK0OoibPkhsJLKm9dnYFx9e3XTCY6d6hcI6WMEC9kCFpEHXHuub2UFc_dCfUA',
    amount: '₹12,450.00',
    status: 'pending',
    statusLabel: 'Pending',
    upiId: 'rahul@upi',
    date: '24 Oct 2023',
    actions: 'approve',
  },
  {
    id: 'PYT-8819',
    userId: 'USR-2045',
    name: 'Sneha Malhotra',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYskoT5YFNyHKwHjjoo9YWt9SEgDDYCZ7luGZIk39OOvB2k3T9E3dknvjiY-iONELT35LsbjTSMjevEfkSdVkiIMcMnVekIjXgdSmy6ZMDjEGOzD25K7FeM9rcwLmq1fYvrch_HHL1WPxXwMYlAmdsqxnZ1pUg1j0h20JTfR0krnxewTti9TqomL0letliIWumdyooc0Vl5VNwfgtBQOxJYDSRvHjxxI5Z7TeaPLGc1xJQ8XDCdJt8QdJvg_vrip8Kgd9dLKJ4HH0',
    amount: '₹8,200.00',
    status: 'approved',
    statusLabel: 'Approved',
    upiId: 'sneha.m@oksbi',
    date: '23 Oct 2023',
    actions: 'complete-reject',
  },
  {
    id: 'PYT-8815',
    userId: 'USR-1002',
    name: 'Ankit Kumar',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUfFT0T-KMyC9mK_xw3sUP3ecHGm8TRGOkNd2DS-nmLNXoF1N8K1noblbDOCmRllYNO2VxDSy6PE3S7NUi4b6vVd0zRLZwvtxJCxlxFrvrWSns4bL0sttDnZliCzjCFg4h0vf6K_zeUKln6Z6iwDYzgltWiJMXpM5WYBLsqMnBxCtR8H992xLENz-WMOCGJGsJOi92ix7M6Ef2N6UG9-4F-rnqQaDcjfE1fo63kbtad2IJAs9wCC_ZjJ0o-rF55LacXEQrUeRnTNw',
    amount: '₹24,000.00',
    status: 'completed',
    statusLabel: 'Completed',
    upiId: 'ankit.pay@ybl',
    date: '21 Oct 2023',
    actions: 'processed',
  },
  {
    id: 'PYT-8810',
    userId: 'USR-2045',
    name: 'Pooja Jain',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMwzsmMoDQkU8pLHd-YlFmpAIzXp2ky-DQYPRFbgju62iXDas67dojbVDbpgdrRh154IBSU9BNWvuMJfavbASS3-2AYFA45Mbdbaz5ikm_OGP67yb23ZdtKboRszGlEjdZPd11BH3Oh8487O8p6kESv0FmR3PUS37lpTHHyjv0iE4bij_qwgtQO5jPJ-OGPaBM-guqYmbF9s5tnt_wqtG8QqodSf_MjnO7Tn2ELLgxNvyATO0xbTFUwKUIu1JfBqI5X7bo4eXQEjo',
    amount: '₹1,500.00',
    status: 'rejected',
    statusLabel: 'Rejected',
    upiId: 'pjain@axis',
    date: '19 Oct 2023',
    actions: 'retry',
  },
  {
    id: 'PYT-8805',
    userId: 'USR-1003',
    name: 'Deepak Sharma',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5n9OKxOOHjpDL1BDJOTS15dvDrv_1u1bc8Mer1FJD0PsIxRqysS-GwvwDGpFPCipOfjM-bU4Bo6Z2_SIA1lbKHicDdWKfkMG7O1gcsdu1FaRF68kqNWdzabEcKO_OkWbzCj7EiutLekim5tS6eaCx3ybscoSALdMEEgajjDYNPJAEBZ8oBlyvQEqc0ewIlcZrR52xLEsnPK9XshZ1MeT_4vgWXdAo0mvLyRx_wx8GM47DjUrI9rm-zptcoInz24ElUYgWnKmRrrk',
    amount: '₹5,500.00',
    status: 'pending',
    statusLabel: 'Pending',
    upiId: 'deepak@icici',
    date: '18 Oct 2023',
    actions: 'approve',
  },
];

function PayoutRowActions({ type, status }) {
  if (status === 'rejected') {
    return <div className="text-right pr-4 text-on-surface-variant font-bold">—</div>;
  }
  if (type === 'approve') {
    return (
      <button type="button" className="btn-sm-primary">
        Approve
      </button>
    );
  }
  if (type === 'complete-reject') {
    return (
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-sm-success">
          Complete
        </button>
        <button type="button" className="btn-sm-danger-outline">
          Reject
        </button>
      </div>
    );
  }
  if (type === 'processed') {
    return <span className="text-sm italic text-on-surface-variant">Processed</span>;
  }
  if (type === 'retry') {
    return (
      <button type="button" className="btn-link">
        Retry
      </button>
    );
  }
  return null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function PayoutManagementPage() {
  const [showFilters, setShowFilters] = useState(false);

  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(PAYOUT_REQUESTS, {
    searchFields: ['id', 'userId', 'name', 'upiId'],
    initialFilters: { 
      status: '',
      userId: '',
      userName: '',
      dateRange: '',
      startDate: '',
      endDate: '',
    },
  });

  // Unique options for dropdowns
  const options = useMemo(() => ({
    userIds: [...new Set(PAYOUT_REQUESTS.map(p => p.userId))].sort(),
    userNames: [...new Set(PAYOUT_REQUESTS.map(p => p.name))].sort(),
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Date'],
    statuses: ['All', 'pending', 'approved', 'completed', 'rejected'],
  }), []);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <PageContainer>
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PAYOUT_STATS.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants} className="min-w-0">
              <RevenueMetricCard {...stat} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="mt-8 w-full overflow-hidden">
        <DistributionCard title="Payout Distribution" segments={DISTRIBUTION_SEGMENTS} />
      </section>

      <section className="mt-8">
        <AdminTableCard
          title="Recent Requests"
          toolbar={
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <TableSearchToolbar 
                    searchPlaceholder="Search by ID, User ID, name or UPI..." 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFilterClick={() => setShowFilters(!showFilters)}
                    onReset={resetFilters}
                    showReset={searchQuery || hasActiveFilters}
                    hideLegacyFilter={true}
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 h-[56px]"
                >
                  <MaterialIcon name="tune" className="!text-[20px]" />
                  <span>Filter</span>
                  {hasActiveFilters && (
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse border-2 border-white" />
                  )}
                </button>
              </div>

              <FilterPanel isOpen={showFilters} onReset={resetFilters}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SearchableSelect
                    label="User ID"
                    options={options.userIds}
                    value={filters.userId}
                    onChange={(val) => updateFilter('userId', val)}
                    placeholder="Any User ID"
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
                    label="Status"
                    options={options.statuses}
                    value={filters.status}
                    onChange={(val) => updateFilter('status', val)}
                    placeholder="Any Status"
                    icon="info"
                  />
                  <SearchableSelect
                    label="Requested Date"
                    options={options.dateRanges}
                    value={filters.dateRange}
                    onChange={(val) => updateFilter('dateRange', val)}
                    placeholder="All Time"
                    icon="calendar_today"
                  />
                </div>

                <AnimatePresence>
                  {filters.dateRange === 'Custom Date' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-outline-variant/50 mt-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                          Start Date
                        </label>
                        <div className="relative">
                          <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                          <input
                            type="date"
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-on-surface"
                            value={filters.startDate}
                            onChange={(e) => updateFilter('startDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                          End Date
                        </label>
                        <div className="relative">
                          <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                          <input
                            type="date"
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-on-surface"
                            value={filters.endDate}
                            onChange={(e) => updateFilter('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FilterPanel>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="table-head">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className={`border-b border-outline-variant px-6 py-4 ${
                        col === 'Amount' || col === 'Actions' ? 'text-right' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="type-body-md divide-y divide-outline-variant text-on-surface">
                <AnimatePresence>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((row) => (
                      <motion.tr 
                        key={row.id} 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="table-row"
                      >
                        <td className="table-cell-mono px-6 py-5">#{row.userId}</td>
                        <td className="px-6 py-5">
                          <TableUserCell name={row.name} avatarUrl={row.avatarUrl} />
                        </td>
                        <td className="px-6 py-5 text-right font-bold">{row.amount}</td>
                        <td className="px-6 py-5">
                          <StatusBadge variant={row.status}>{row.statusLabel}</StatusBadge>
                        </td>
                        <td className="px-6 py-5 italic text-on-surface-variant">{row.upiId}</td>
                        <td className="px-6 py-5 text-on-surface-variant">{row.date}</td>
                        <td className="table-cell-actions px-6 py-5">
                          <PayoutRowActions type={row.actions} status={row.status} />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr 
                      key="no-results"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={TABLE_COLUMNS.length} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                          <MaterialIcon name="payments" className="!text-5xl opacity-20" />
                          <p className="type-title-md">No payout requests found</p>
                          <button onClick={resetFilters} className="mt-2 text-primary font-semibold hover:underline">
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
        </AdminTableCard>
      </section>
    </PageContainer>
  );
}
