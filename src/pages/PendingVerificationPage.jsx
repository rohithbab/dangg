import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout';
import { Stagger, Reveal } from '../components/motion/primitives';
import { ValuePlaceholder, LoadingBar } from '../components/motion/Placeholder';
import { VerificationRequestCard } from '../components/ui/VerificationRequestCard';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { adminApi } from '../lib/adminApi';
import { formatPhone } from '../lib/utils';

async function fetchPendingVerifications() {
  const rows = await adminApi('pendingVerifications')
  return rows.map((f) => ({
    id: f.id.substring(0, 8).toUpperCase(),
    fullId: f.id,
    name: f.users?.name || 'Unknown',
    phone: formatPhone(f.users?.phone),
    imageUrl: f.signedPhotoUrl || f.users?.profile_picture_url || null,
    imageAlt: `${f.users?.name || 'User'} verification photo`,
    hasVerificationPhoto: !!f.signedPhotoUrl,
  }))
}

export function PendingVerificationPage() {
  const { data: verifications, loading, refetch } = useAdminQuery(fetchPendingVerifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState({})
  const [optimisticRemoved, setOptimisticRemoved] = useState(new Set())
  const [rejectModal, setRejectModal] = useState(null) // { fullId, name }
  const [rejectReason, setRejectReason] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const handleApprove = useCallback(async (fullId, name) => {
    setActionLoading(prev => ({ ...prev, [fullId]: 'approve' }))
    let error = null
    try { await adminApi('approveVerification', { femaleId: fullId }) } catch (e) { error = e }
    setActionLoading(prev => ({ ...prev, [fullId]: null }))

    if (error) {
      showToast(`Failed to approve ${name}: ${error.message}`, 'error')
      return
    }
    setOptimisticRemoved(prev => new Set([...prev, fullId]))
    showToast(`${name} approved successfully`)
    refetch()
  }, [refetch, showToast])

  const openRejectModal = useCallback((fullId, name) => {
    setRejectModal({ fullId, name })
    setRejectReason('')
  }, [])

  const handleReject = useCallback(async () => {
    if (!rejectModal) return
    const { fullId, name } = rejectModal
    setActionLoading(prev => ({ ...prev, [fullId]: 'reject' }))
    let error = null
    try {
      await adminApi('rejectVerification', { femaleId: fullId, reason: rejectReason.trim() })
    } catch (e) { error = e }
    setActionLoading(prev => ({ ...prev, [fullId]: null }))

    if (error) {
      showToast(`Failed to reject ${name}: ${error.message}`, 'error')
      setRejectModal(null)
      return
    }
    setOptimisticRemoved(prev => new Set([...prev, fullId]))
    setRejectModal(null)
    showToast(`${name} rejected`, 'warning')
    refetch()
  }, [rejectModal, rejectReason, refetch, showToast])

  const stats = useMemo(() => {
    const total = (verifications || []).filter(v => !optimisticRemoved.has(v.fullId)).length
    return [
      { label: 'Pending Review', value: total, icon: 'pending', accent: 'bg-warn-soft text-warn' },
      { label: 'Reviewed Today', value: 0, icon: 'check_circle', accent: 'bg-good-soft text-good' },
      { label: 'Avg. Wait Time', value: '—', icon: 'schedule', accent: 'bg-info-soft text-info' },
    ]
  }, [verifications, optimisticRemoved])

  const filtered = (verifications || []).filter(v => {
    if (optimisticRemoved.has(v.fullId)) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      v.name.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      v.phone.toLowerCase().includes(q)
    )
  })

  return (
    <PageContainer>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed right-5 top-[70px] z-[90] flex items-center gap-3 rounded-well px-5 py-3.5
                        text-body-sm font-semibold text-white shadow-pop ${
              toast.type === 'error' ? 'bg-critical' : toast.type === 'warning' ? 'bg-warn' : 'bg-good'
            }`}
          >
            <MaterialIcon name={toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'check_circle'} className="!text-[20px]" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject reason modal */}
      <AnimatePresence>
        {rejectModal && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/25 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              className="card card-pad-lg w-full max-w-md space-y-5"
            >
              <div>
                <h3 className="font-display text-display-md text-ink">Reject Verification</h3>
                <p className="mt-1 text-body-sm text-ink-2">
                  Rejecting <span className="font-semibold text-ink">{rejectModal.name}</span>. The user will be notified.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-label uppercase text-ink-3">
                  Reason (optional)
                </label>
                <textarea
                  className="w-full resize-none rounded-well border border-hairline bg-canvas-sunk px-4 py-3
                             text-body text-ink outline-none transition-all placeholder:text-ink-3
                             focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
                  rows={3}
                  placeholder="e.g. Photo is blurry, face not visible..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModal(null)}
                  className="btn btn-ghost flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading[rejectModal.fullId] === 'reject'}
                  className="btn flex-1 bg-critical py-3 text-white hover:opacity-90"
                >
                  {actionLoading[rejectModal.fullId] === 'reject' ? 'Rejecting…' : 'Confirm Reject'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LoadingBar active={loading} />

      {/* Header + stats */}
      <div className="mb-6 space-y-5 above-grain">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Verification Queue</h1>
              <p className="mt-1 text-body text-ink-2">
                Female accounts awaiting manual identity review
              </p>
            </div>
            {!loading && filtered.length > 0 && (
              <span className="pill pill-warn">
                <span className="material-symbols-outlined text-[13px]">pending</span>
                {filtered.length} awaiting
              </span>
            )}
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-3 xs:grid-cols-3 sm:gap-4" gap={0.07}>
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="card card-pad flex items-center gap-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-well ${s.accent}`}>
                  <MaterialIcon name={s.icon} className="!text-[21px]" />
                </span>
                <div className="min-w-0">
                  <p className="metric-label">{s.label}</p>
                  <p className="mt-0.5 font-display text-metric-sm text-ink tabular">
                    {loading ? <ValuePlaceholder sample="00" /> : s.value}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </Stagger>

        {/* Search */}
        <Reveal>
          <div className="relative w-full max-w-lg">
            <MaterialIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 !text-[20px] text-ink-3"
            />
            <input
              type="text"
              aria-label="Search verification requests"
              className="w-full rounded-well border border-hairline bg-card py-3 pl-12 pr-10 text-body
                         text-ink shadow-card outline-none transition-all placeholder:text-ink-3
                         focus:border-ember focus:ring-2 focus:ring-ember-soft"
              placeholder="Search by name, ID or phone…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center
                           rounded-full text-ink-3 transition-colors hover:bg-canvas-sunk hover:text-ink"
              >
                <MaterialIcon name="close" className="!text-[17px]" />
              </button>
            )}
          </div>
        </Reveal>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-64 overflow-hidden">
              <div className="h-36 shimmer-bar" />
              <div className="space-y-2 p-5">
                <div className="h-3 w-1/2 rounded shimmer-bar" />
                <div className="h-3 w-1/3 rounded shimmer-bar" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="min-h-[400px]">
          <AnimatePresence>
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((request) => (
                  <motion.div
                    key={request.fullId}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VerificationRequestCard
                      {...request}
                      actionLoading={actionLoading[request.fullId]}
                      onApprove={() => handleApprove(request.fullId, request.name)}
                      onReject={() => openRejectModal(request.fullId, request.name)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border-2 border-dashed border-hairline shadow-card"
              >
                <span className="w-16 h-16 rounded-2xl bg-canvas-sunk flex items-center justify-center mb-4">
                  <MaterialIcon name="person_search" className="!text-4xl text-ink-2/40" />
                </span>
                <h3 className="type-title-lg text-ink">
                  {searchQuery ? 'No results found' : 'No pending verifications'}
                </h3>
                <p className="type-body-md text-ink-2 mt-1 text-center max-w-xs">
                  {searchQuery
                    ? 'Try a different search term.'
                    : 'All female accounts are verified or no submissions yet.'}
                </p>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mt-6 btn-secondary">
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </PageContainer>
  )
}
