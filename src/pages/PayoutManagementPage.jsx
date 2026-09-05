import { useState, useMemo, useCallback } from 'react';
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
import { adminApi } from '../lib/adminApi';
import { formatRupees, formatDate, shortId } from '../lib/utils';
import { Reveal } from '../components/motion/primitives';
import { ValuePlaceholder, LoadingBar } from '../components/motion/Placeholder';

async function fetchPayouts() {
  return adminApi('payouts')
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

const TABLE_COLUMNS = ['User ID', 'User Name', 'Amount', 'Status', 'UPI / Account', 'Requested Date', 'Actions']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Action modal component ────────────────────────────────────────────────────
function ActionModal({ modal, onClose, onConfirm, actionLoading }) {
  const [utr, setUtr] = useState('')
  const [reason, setReason] = useState('')
  if (!modal) return null

  const isComplete = modal.action === 'complete'
  const isReject = modal.action === 'reject'
  const busy = !!actionLoading

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/25 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card card-pad-lg w-full max-w-md space-y-5"
      >
        <div>
          <h3 className="font-display text-display-md text-ink">
            {isComplete ? 'Mark as Completed' : 'Reject Payout'}
          </h3>
          <p className="mt-1 text-body-sm text-ink-2">
            {isComplete
              ? `Enter the UTR number to confirm payment to ${modal.name}.`
              : `Rejecting payout for ${modal.name}. Coins will be refunded automatically.`}
          </p>
        </div>

        {isComplete && (
          <div className="space-y-2">
            <label className="text-label uppercase text-ink-3">
              UTR Number <span className="text-critical">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-well border border-hairline bg-canvas-sunk px-4 py-3 text-body text-ink outline-none transition-all placeholder:text-ink-3 focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
              placeholder="e.g. 123456789012"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
            />
          </div>
        )}

        {isReject && (
          <div className="space-y-2">
            <label className="text-label uppercase text-ink-3">
              Reason (optional)
            </label>
            <textarea
              className="w-full resize-none rounded-well border border-hairline bg-canvas-sunk px-4 py-3 text-body text-ink outline-none transition-all placeholder:text-ink-3 focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
              rows={3}
              placeholder="e.g. Invalid UPI ID, account not found..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={busy}
            className="btn btn-ghost flex-1 py-3"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ utr, reason })}
            disabled={busy || (isComplete && !utr.trim())}
            className={`btn flex-1 py-3 text-white ${
              isReject ? 'bg-critical hover:opacity-90' : 'btn-ember'
            }`}
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Processing…
              </span>
            ) : isComplete ? 'Confirm Completed' : 'Confirm Reject'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function PayoutManagementPage() {
  const { data: rawPayouts, loading, refetch } = useAdminQuery(fetchPayouts)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ status: '', dateRange: '' })
  const [modal, setModal] = useState(null) // { action, payoutId, femaleId, coinsRequested, name }
  const [actionLoading, setActionLoading] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const handleApprove = useCallback(async (payoutId) => {
    setActionLoading(prev => ({ ...prev, [payoutId]: 'approve' }))
    let error = null
    try { await adminApi('approvePayout', { payoutId }) } catch (e) { error = e }
    setActionLoading(prev => ({ ...prev, [payoutId]: null }))

    if (error) {
      showToast(`Approve failed: ${error.message}`, 'error')
      return
    }
    showToast('Payout approved')
    refetch()
  }, [refetch, showToast])

  const handleModalConfirm = useCallback(async ({ utr, reason }) => {
    if (!modal) return
    const { action, payoutId, femaleId, coinsRequested } = modal
    setActionLoading(prev => ({ ...prev, [payoutId]: action }))

    if (action === 'complete') {
      try {
        await adminApi('completePayout', { payoutId, utr: utr.trim() })
        showToast('Payout marked as completed')
      } catch (e) {
        showToast(`Complete failed: ${e.message}`, 'error')
        setActionLoading(prev => ({ ...prev, [payoutId]: null }))
        setModal(null)
        return
      }
      setActionLoading(prev => ({ ...prev, [payoutId]: null }))
    }

    if (action === 'reject') {
      /* The refund-then-flip ordering now lives server-side in admin-api, so
         the coins can never be lost to a half-completed sequence in the
         browser (a closed tab used to be able to do exactly that). */
      try {
        await adminApi('rejectPayout', {
          payoutId,
          femaleId,
          coinsRequested,
          reason: reason.trim(),
        })
        showToast('Payout rejected, coins refunded', 'warning')
      } catch (e) {
        showToast(`Reject failed: ${e.message}`, 'error')
        setActionLoading(prev => ({ ...prev, [payoutId]: null }))
        setModal(null)
        return
      }
      setActionLoading(prev => ({ ...prev, [payoutId]: null }))
    }

    setModal(null)
    refetch()
  }, [modal, refetch, showToast])

  const payouts = useMemo(() => (rawPayouts || []).map(p => {
    const detail = Array.isArray(p.payout_details) ? p.payout_details[0] : p.payout_details
    const upiOrAccount = detail?.upi_id || (detail?.account_number ? `****${detail.account_number.slice(-4)}` : '—')
    return {
      id: shortId(p.id),
      fullId: p.id,
      femaleId: p.female_id,
      coinsRequested: p.coins_requested,
      name: p.users?.name || 'Unknown',
      avatarUrl: p.users?.profile_picture_url || null,
      amount: formatRupees(p.payout_amount_paisa),
      status: p.status,
      statusLabel: statusLabel(p.status),
      upiId: upiOrAccount,
      date: formatDate(p.requested_at),
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
    { label: 'Total Requests', value: counts.total, isCount: true, icon: 'list_alt', accent: 'primary', badge: <span className="badge-neutral">All time</span> },
    { label: 'Pending', value: counts.pending, isCount: true, icon: 'pending', accent: 'tertiary', badge: <span className="badge-neutral">Awaiting approval</span> },
    { label: 'Completed', value: counts.completed, isCount: true, icon: 'check_circle', accent: 'good', badge: <span className="badge-trend-up flex items-center gap-1"><MaterialIcon name="verified" size="sm" />Payout successful</span> },
    { label: 'Rejected', value: counts.rejected, isCount: true, icon: 'cancel', accent: 'error', badge: <span className="font-label-sm text-label-sm normal-case text-critical">Validation failed</span> },
    { label: 'Processing', value: counts.processing, isCount: true, icon: 'sync', accent: 'secondary', badge: <span className="badge-neutral">In transit</span> },
  ]

  const hasActiveFilters = Object.values(filters).some(v => v !== '')
  const options = {
    statuses: ['All', 'pending', 'approved', 'completed', 'rejected', 'failed', 'cancelled'],
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days'],
  }

  function renderActions(row) {
    const loading = actionLoading[row.fullId]
    const busy = !!loading

    if (row.status === 'pending') {
      return (
        <button
          type="button"
          className="btn-sm-primary flex items-center gap-1.5 disabled:opacity-60"
          disabled={busy}
          onClick={() => handleApprove(row.fullId)}
        >
          {loading === 'approve' ? (
            <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : null}
          {loading === 'approve' ? 'Approving…' : 'Approve'}
        </button>
      )
    }
    if (row.status === 'approved') {
      return (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn-sm-success flex items-center gap-1.5 disabled:opacity-60"
            disabled={busy}
            onClick={() => setModal({ action: 'complete', payoutId: row.fullId, femaleId: row.femaleId, coinsRequested: row.coinsRequested, name: row.name })}
          >
            {loading === 'complete' ? <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
            Complete
          </button>
          <button
            type="button"
            className="btn-sm-danger-outline flex items-center gap-1.5 disabled:opacity-60"
            disabled={busy}
            onClick={() => setModal({ action: 'reject', payoutId: row.fullId, femaleId: row.femaleId, coinsRequested: row.coinsRequested, name: row.name })}
          >
            Reject
          </button>
        </div>
      )
    }
    if (row.status === 'completed') {
      return <span className="text-sm italic text-ink-2">Processed</span>
    }
    if (row.status === 'processing') {
      return <span className="text-sm font-semibold text-ember">In transit</span>
    }
    return <div className="text-right pr-4 text-ink-2 font-bold">—</div>
  }

  return (
    <PageContainer>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed right-5 top-[70px] z-[90] flex items-center gap-3 rounded-well px-5 py-3.5 text-body-sm font-semibold text-white shadow-pop ${
              toast.type === 'error' ? 'bg-critical' : toast.type === 'warning' ? 'bg-warn' : 'bg-good'
            }`}
          >
            <MaterialIcon name={toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'check_circle'} className="!text-[20px]" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ActionModal
            modal={modal}
            onClose={() => setModal(null)}
            onConfirm={handleModalConfirm}
            actionLoading={actionLoading[modal.payoutId]}
          />
        )}
      </AnimatePresence>

      <LoadingBar active={loading} />

      <Reveal>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-display-lg text-ink">Payouts</h1>
            <p className="mt-1 text-body text-ink-2">
              Creator withdrawal requests and settlement
            </p>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card card-pad">
                <div className="mb-3 h-3 w-2/3 rounded shimmer-bar" />
                <div className="font-display text-metric"><ValuePlaceholder sample="000" /></div>
              </div>
            ))}
          </div>
          <div className="card h-20" />
          <div className="card overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-hairline px-5 py-4">
                <div className="h-9 w-9 shrink-0 rounded-full shimmer-bar" />
                <div className="h-3 w-32 rounded shimmer-bar" />
                <div className="ml-auto h-3 w-20 rounded shimmer-bar" />
              </div>
            ))}
          </div>
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
                      className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all bg-ember text-white shadow-lg shadow-accent-glow hover:bg-ember/90 h-[56px]"
                    >
                      <MaterialIcon name="tune" className="!text-[20px]" />
                      <span>Filter</span>
                      {hasActiveFilters && <span className="w-2.5 h-2.5 rounded-full bg-critical animate-pulse border-2 border-white" />}
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
                        <th key={col} className={`border-b border-hairline px-6 py-4 ${col === 'Amount' || col === 'Actions' ? 'text-right' : ''}`}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="type-body-md divide-y divide-hairline text-ink">
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
                            <td className="table-cell-mono px-6 py-5">#{row.id}</td>
                            <td className="px-6 py-5"><TableUserCell name={row.name} avatarUrl={row.avatarUrl} /></td>
                            <td className="px-6 py-5 text-right font-bold">{row.amount}</td>
                            <td className="px-6 py-5"><StatusBadge variant={row.status}>{row.statusLabel}</StatusBadge></td>
                            <td className="px-6 py-5 italic text-ink-2">{row.upiId}</td>
                            <td className="px-6 py-5 text-ink-2">{row.date}</td>
                            <td className="table-cell-actions px-6 py-5">{renderActions(row)}</td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <td colSpan={TABLE_COLUMNS.length} className="text-center py-20">
                            <div className="flex flex-col items-center gap-2 text-ink-2">
                              <MaterialIcon name="payments" className="!text-5xl opacity-20" />
                              <p className="type-title-md">No payout requests found</p>
                              <button onClick={() => { setSearchQuery(''); setFilters({ status: '', dateRange: '' }) }} className="mt-2 text-ember font-semibold hover:underline">
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
