import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
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

export function PendingVerificationPage() {
  const { data: verifications, loading } = useAdminQuery(fetchPendingVerifications)
  const [searchQuery, setSearchQuery] = useState('')

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
      <PageHeader description="Female accounts awaiting manual review">
        <div className="relative w-full max-w-sm">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
            placeholder="Search by name, ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
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
                className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant"
              >
                <MaterialIcon name="person_search" className="!text-6xl text-outline-variant mb-4" />
                <h3 className="type-title-lg text-on-surface">
                  {searchQuery ? 'No results found' : 'No pending verifications'}
                </h3>
                <p className="type-body-md text-on-surface-variant mt-1">
                  {searchQuery
                    ? 'Try a different search term.'
                    : 'All female accounts are verified or no submissions yet.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-6 btn-secondary"
                  >
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
