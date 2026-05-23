import { useState } from 'react';
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
import { useDataFilter } from '../hooks/useDataFilter';

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

function PayoutRowActions({ type }) {
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
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useDataFilter(PAYOUT_REQUESTS, {
    searchFields: ['id', 'name', 'upiId'],
    initialFilters: { status: 'all' },
  });

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
              <TableSearchToolbar 
                searchPlaceholder="Search by ID, name or UPI..." 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterClick={() => setShowFilters(!showFilters)}
                onReset={resetFilters}
                showReset={searchQuery || filters.status !== 'all'}
              />
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant"
                >
                  {['all', 'pending', 'approved', 'completed', 'rejected'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('status', s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                        filters.status === s
                          ? 'bg-primary text-on-primary'
                          : 'bg-white hover:bg-surface-container text-on-surface-variant border border-outline-variant'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
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
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <motion.tr 
                        key={row.id} 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="table-row"
                      >
                        <td className="table-cell-mono px-6 py-5">#{row.id}</td>
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
                          <PayoutRowActions type={row.actions} />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={TABLE_COLUMNS.length} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                          <MaterialIcon name="payments" className="!text-5xl opacity-20" />
                          <p className="type-title-md">No payout requests found</p>
                          <button onClick={resetFilters} className="mt-2 text-primary font-semibold hover:underline">
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
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
