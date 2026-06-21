import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { RevenueMetricCard } from '../components/ui/RevenueMetricCard';
import { DistributionCard } from '../components/ui/DistributionCard';
import { AdminTableCard } from '../components/ui/AdminTableCard';
import { TableSearchToolbar } from '../components/ui/TableSearchToolbar';
import { TableUserCell } from '../components/ui/TableUserCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatRupees, formatDate, formatPhone, shortId } from '../lib/utils';

async function fetchPayouts() {
  const { data, error } = await supabase
    .from('payouts')
    .select(`
      id,
      status,
      payout_amount_paisa,
      requested_at,
      utr_number,
      users!inner (
        name,
        profile_picture_url
      ),
      payout_details (
        upi_id,
        account_number,
        method
      )
    `)
    .order('requested_at', { ascending: false })

  if (error) throw error
  return data || []
}

function statusActions(status) {
  if (status === 'pending') return 'approve'
  if (status === 'approved') return 'complete-reject'
  if (status === 'completed') return 'processed'
  if (status === 'rejected' || status === 'failed' || status === 'cancelled') return 'none'
  if (status === 'processing') return 'processing'
  return 'none'
}

function statusLabel(status) {
  const map = {
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    failed: 'Failed',
    cancelled: 'Cancelled',
    processing: 'Processing',
  }
  return map[status] || status
}

function PayoutRowActions({ type }) {
  if (type === 'none') {
    return <div className="text-right pr-4 text-on-surface-variant font-bold">—</div>
  }
  if (type === 'approve') {
    return <button type="button" className="btn-sm-primary" disabled>Approve</button>
  }
  if (type === 'complete-reject') {
    return (
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-sm-success" disabled>Complete</button>
        <button type="button" className="btn-sm-danger-outline" disabled>Reject</button>
      </div>
    )
  }
  if (type === 'processed') {
    return <span className="text-sm italic text-on-surface-variant">Processed</span>
  }
  if (type === 'processing') {
    return <span className="text-sm font-semibold text-primary">In transit</span>
  }
  return null
}

const TABLE_COLUMNS = ['User ID', 'User Name', 'Amount', 'Status', 'UPI / Account', 'Requested Date', 'Actions']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export function PayoutManagementPage() {
  const { data: rawPayouts, loading } = useAdminQuery(fetchPayouts)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ status: '', dateRange: '' })

  const payouts = useMemo(() => (rawPayouts || []).map(p => {
    const detail = Array.isArray(p.payout_details) ? p.payout_details[0] : p.payout_details
    const upiOrAccount = detail?.upi_id || (detail?.account_number ? `****${detail.account_number.slice(-4)}` : '—')
    return {
      id: shortId(p.id),
      fullId: p.id,
      userId: shortId(p.id),
      name: p.users?.name || 'Unknown',
      avatarUrl: p.users?.profile_picture_url || null,
      amount: formatRupees(p.payout_amount_paisa),
      status: p.status,
      statusLabel: statusLabel(p.status),
      upiId: upiOrAccount,
      date: formatDate(p.requested_at),
      actions: statusActions(p.status),
    }
  }), [rawPayouts])

  const filtered = useMemo(() => payouts.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.upiId.toLowerCase().includes(q)
    const matchStatus = !filters.status || filters.status === 'All' || p.status === filters.status
    return matchSearch && matchStatus
  }), [payouts, searchQuery, filters])

  const counts = useMemo(() => ({
    total: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    rejected: payouts.filter(p => p.status === 'rejected').length,
    processing: payouts.filter(p => ['processing', 'approved'].includes(p.status)).length,
  }), [payouts])

  const total = counts.total || 1
  const distribution = [
    { id: 'pending', label: 'Pending', percent: (counts.pending / total) * 100, percentLabel: `${Math.round((counts.pending / total) * 100)}%`, showLabel: true },
    { id: 'completed', label: 'Completed', percent: (counts.completed / total) * 100, percentLabel: `${Math.round((counts.completed / total) * 100)}%`, showLabel: true },
    { id: 'rejected', label: 'Rejected', percent: (counts.rejected / total) * 100, percentLabel: `${Math.round((counts.rejected / total) * 100)}%`, showLabel: true },
    { id: 'processing', label: 'Processing', percent: (counts.processing / total) * 100, percentLabel: `${Math.round((counts.processing / total) * 100)}%`, showLabel: true },
  ]

  const payoutStats = [
    { label: 'Total Requests', value: String(counts.total), icon: 'list_alt', accent: 'primary', badge: <span className="badge-neutral">All time</span> },
    { label: 'Pending', value: String(counts.pending), icon: 'pending', accent: 'tertiary', badge: <span className="badge-neutral">Awaiting approval</span> },
    { label: 'Completed', value: String(counts.completed), icon: 'check_circle', accent: 'secondary', badge: <span className="badge-trend-up flex items-center gap-1"><MaterialIcon name="verified" size="sm" />Payout successful</span> },
    { label: 'Rejected', value: String(counts.rejected), icon: 'cancel', accent: 'error', badge: <span className="font-label-sm text-label-sm normal-case text-error">Validation failed</span> },
    { label: 'Processing', value: String(counts.processing), icon: 'sync', accent: 'secondary', badge: <span className="badge-neutral">In transit</span> },
  ]

  const hasActiveFilters = Object.values(filters).some(v => v !== '')
  const options = {
    statuses: ['All', 'pending', 'approved', 'completed', 'rejected', 'processing'],
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days'],
  }

  return (
    <PageContainer>
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-surface-container rounded-3xl" />)}
          </div>
          <div className="h-20 bg-surface-container rounded-3xl" />
          <div className="h-64 bg-surface-container rounded-3xl" />
        </div>
      ) : (
        <>
          <motion.section variants={containerVariants} initial="hidden" animate="visible" className="w-full overflow-hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {payoutStats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="min-w-0">
                  <RevenueMetricCard {...stat} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="mt-8 w-full overflow-hidden">
            <DistributionCard title="Payout Distribution" segments={distribution} />
          </section>

          <section className="mt-8">
            <AdminTableCard
              title="Payout Requests"
              toolbar={
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                      <TableSearchToolbar
                        searchPlaceholder="Search by ID, name or UPI..."
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onFilterClick={() => setShowFilters(!showFilters)}
                        onReset={() => { setSearchQuery(''); setFilters({ status: '', dateRange: '' }) }}
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
                      {hasActiveFilters && <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse border-2 border-white" />}
                    </button>
                  </div>
                  <FilterPanel isOpen={showFilters} onReset={() => setFilters({ status: '', dateRange: '' })}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SearchableSelect
                        label="Status"
                        options={options.statuses}
                        value={filters.status}
                        onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        placeholder="Any Status"
                        icon="info"
                      />
                      <SearchableSelect
                        label="Date Range"
                        options={options.dateRanges}
                        value={filters.dateRange}
                        onChange={(val) => setFilters(f => ({ ...f, dateRange: val }))}
                        placeholder="All Time"
                        icon="calendar_today"
                      />
                    </div>
                  </FilterPanel>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="table-head">
                      {TABLE_COLUMNS.map((col) => (
                        <th key={col} className={`border-b border-outline-variant px-6 py-4 ${col === 'Amount' || col === 'Actions' ? 'text-right' : ''}`}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="type-body-md divide-y divide-outline-variant text-on-surface">
                    <AnimatePresence>
                      {filtered.length > 0 ? (
                        filtered.map((row) => (
                          <motion.tr
                            key={row.fullId}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="table-row"
                          >
                            <td className="table-cell-mono px-6 py-5">#{row.userId}</td>
                            <td className="px-6 py-5"><TableUserCell name={row.name} avatarUrl={row.avatarUrl} /></td>
                            <td className="px-6 py-5 text-right font-bold">{row.amount}</td>
                            <td className="px-6 py-5"><StatusBadge variant={row.status}>{row.statusLabel}</StatusBadge></td>
                            <td className="px-6 py-5 italic text-on-surface-variant">{row.upiId}</td>
                            <td className="px-6 py-5 text-on-surface-variant">{row.date}</td>
                            <td className="table-cell-actions px-6 py-5"><PayoutRowActions type={row.actions} /></td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <td colSpan={TABLE_COLUMNS.length} className="text-center py-20">
                            <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                              <MaterialIcon name="payments" className="!text-5xl opacity-20" />
                              <p className="type-title-md">No payout requests found</p>
                              <button onClick={() => { setSearchQuery(''); setFilters({ status: '', dateRange: '' }) }} className="mt-2 text-primary font-semibold hover:underline">
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
        </>
      )}
    </PageContainer>
  )
}
