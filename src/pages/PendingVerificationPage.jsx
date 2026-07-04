import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout';
import { VerificationRequestCard } from '../components/ui/VerificationRequestCard';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatPhone } from '../lib/utils';

async function fetchPendingVerifications() {
  const { data, error } = await supabase
    .from('females')
    .select(`
      id,
      verification_status,
      verification_submitted_at,
      users!inner (
        name,
        phone,
        profile_picture_url
      )
    `)
    .eq('verification_status', 'pending')
    .order('verification_submitted_at', { ascending: true })

  if (error) throw error

  return (data || []).map(f => ({
    id: f.id.substring(0, 8).toUpperCase(),
    fullId: f.id,
    name: f.users?.name || 'Unknown',
    phone: formatPhone(f.users?.phone),
    imageUrl: f.users?.profile_picture_url || null,
    imageAlt: `${f.users?.name || 'User'} profile`,
  }))
}

const statVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }),
}

export function PendingVerificationPage() {
  const { data: verifications, loading } = useAdminQuery(fetchPendingVerifications)
  const [searchQuery, setSearchQuery] = useState('')

  const stats = useMemo(() => {
    const total = (verifications || []).length
    return [
      { label: 'Pending Review', value: total, icon: 'pending', accent: 'text-amber-500 bg-amber-50' },
      { label: 'Reviewed Today', value: 0, icon: 'check_circle', accent: 'text-emerald-600 bg-emerald-50' },
      { label: 'Avg. Wait Time', value: '—', icon: 'schedule', accent: 'text-blue-500 bg-blue-50' },
    ]
  }, [verifications])

  const filtered = (verifications || []).filter(v => {
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
      {/* Header + stats */}
      <div className="mb-8 space-y-6">
        <div>
          <p className="type-body-md text-on-surface-variant">Female accounts awaiting manual identity review</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="bg-surface rounded-2xl shadow-card px-6 py-5 flex items-center gap-4"
            >
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.accent}`}>
                <MaterialIcon name={s.icon} className="!text-[22px]" />
              </span>
              <div>
                <p className="type-label-sm text-on-surface-variant uppercase tracking-widest">{s.label}</p>
                <p className="type-title-lg font-black text-on-surface">{loading ? '—' : s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-lg">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 !text-[22px]" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
            placeholder="Search by name, ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
            >
              <MaterialIcon name="close" className="!text-[18px] text-on-surface-variant" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-surface rounded-2xl shadow-card" />
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
                    <VerificationRequestCard {...request} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border-2 border-dashed border-outline-variant shadow-card"
              >
                <span className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                  <MaterialIcon name="person_search" className="!text-4xl text-on-surface-variant/40" />
                </span>
                <h3 className="type-title-lg text-on-surface">
                  {searchQuery ? 'No results found' : 'No pending verifications'}
                </h3>
                <p className="type-body-md text-on-surface-variant mt-1 text-center max-w-xs">
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
