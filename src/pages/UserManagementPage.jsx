import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { UserIdentityCell } from '../components/ui/UserIdentityCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatDate, getInitials, shortId } from '../lib/utils';
import { Reveal } from '../components/motion/primitives';
import { LoadingBar } from '../components/motion/Placeholder';

async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      phone,
      role,
      age,
      is_active,
      is_suspended,
      profile_picture_url,
      created_at,
      males (coin_balance, chats_initiated),
      females (verification_status, is_online)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

const TABLE_COLUMNS = ['User', 'Gender', 'Join Date', 'Age', 'Status', 'View']
const AVATAR_VARIANTS = ['primary', 'secondary', 'tertiary', 'neutral', 'accent']

export function UserManagementPage() {
  const { data: rawUsers, loading } = useAdminQuery(fetchUsers)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ gender: '', ageRange: '' })

  const users = useMemo(() => (rawUsers || []).map((u, i) => ({
    id: u.id,
    displayId: shortId(u.id),
    name: u.name || 'Unknown',
    phone: u.phone || '',
    gender: u.role,
    age: u.age || '—',
    joinDate: formatDate(u.created_at),
    is_active: u.is_active,
    is_suspended: u.is_suspended,
    initials: getInitials(u.name),
    avatarVariant: AVATAR_VARIANTS[i % AVATAR_VARIANTS.length],
    avatarUrl: u.profile_picture_url || null,
    maleData: Array.isArray(u.males) ? u.males[0] : u.males,
    femaleData: Array.isArray(u.females) ? u.females[0] : u.females,
  })), [rawUsers])

  const filtered = useMemo(() => users.filter(u => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.displayId.toLowerCase().includes(q) ||
      (u.gender || '').toLowerCase().includes(q)
    const matchGender = !filters.gender || filters.gender === 'All' || u.gender === filters.gender
    const matchAge = !filters.ageRange || (() => {
      const age = Number(u.age)
      if (!age) return true
      if (filters.ageRange === '18-24') return age >= 18 && age <= 24
      if (filters.ageRange === '25-30') return age >= 25 && age <= 30
      if (filters.ageRange === '31-40') return age >= 31 && age <= 40
      if (filters.ageRange === '40+') return age > 40
      return true
    })()
    return matchSearch && matchGender && matchAge
  }), [users, searchQuery, filters])

  const options = {
    genders: ['All', 'male', 'female'],
    ageRanges: ['18-24', '25-30', '31-40', '40+'],
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  function userStatus(u) {
    if (u.is_suspended) return { label: 'Suspended', variant: 'error' }
    if (u.gender === 'female') {
      const vs = u.femaleData?.verification_status
      if (vs === 'verified') return { label: 'Verified', variant: 'success' }
      if (vs === 'pending') return { label: 'Pending', variant: 'warning' }
      return { label: 'Unverified', variant: 'neutral' }
    }
    return u.is_active ? { label: 'Active', variant: 'success' } : { label: 'Inactive', variant: 'neutral' }
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-shell space-y-5 above-grain">
        <LoadingBar active={loading} />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Users</h1>
              <p className="mt-1 text-body text-ink-2">
                Every registered account across both roles
              </p>
            </div>
            {!loading && (
              <span className="pill pill-neutral">
                <span className="material-symbols-outlined text-[13px]">group</span>
                {filtered.length} shown
              </span>
            )}
          </div>
        </Reveal>

        <div className="card card-pad space-y-4">
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="relative w-full flex-1">
              <MaterialIcon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 !text-[20px] text-ink-3"
              />
              <input
                type="text"
                aria-label="Search users"
                className="w-full rounded-well border border-hairline bg-canvas-sunk py-3 pl-12 pr-4 text-body
                           text-ink outline-none transition-all placeholder:text-ink-3
                           focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
                placeholder="Search users by name, phone, ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-primary relative shrink-0 py-3"
            >
              <MaterialIcon name="tune" className="!text-[18px]" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-ember ring-2 ring-card" />
              )}
            </button>
          </div>

          <FilterPanel isOpen={showFilters} onReset={() => setFilters({ gender: '', ageRange: '' })}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchableSelect label="Gender" options={options.genders} value={filters.gender} onChange={val => setFilters(f => ({ ...f, gender: val }))} placeholder="Both Genders" icon="wc" />
              <SearchableSelect label="Age Range" options={options.ageRanges} value={filters.ageRange} onChange={val => setFilters(f => ({ ...f, ageRange: val }))} placeholder="All Ages" icon="cake" />
            </div>
          </FilterPanel>
        </div>

        {loading ? (
          <div className="card overflow-hidden">
            <div className="flex items-center gap-4 bg-canvas-sunk px-5 py-3.5">
              <div className="h-3 w-24 rounded shimmer-bar" />
              <div className="ml-auto h-3 w-16 rounded shimmer-bar" />
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-hairline px-5 py-4">
                <div className="h-9 w-9 shrink-0 rounded-full shimmer-bar" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 rounded shimmer-bar" />
                  <div className="h-2.5 w-20 rounded shimmer-bar" />
                </div>
                <div className="ml-auto h-3 w-24 rounded shimmer-bar" />
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-card border-b border-hairline">
                    {TABLE_COLUMNS.map((col) => (
                      <th key={col} className={`px-8 py-5 text-xs font-black uppercase tracking-widest text-ink-2 ${col === 'View' ? 'text-center' : ''}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/40">
                  <AnimatePresence>
                    {filtered.length > 0 ? (
                      filtered.map((user) => {
                        const profilePath = user.gender === 'male' ? `/users/male/${user.id}` : `/users/female/${user.id}`
                        const status = userStatus(user)
                        return (
                          <motion.tr
                            key={user.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="hover:bg-canvas-sunk transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <Link to={profilePath} className="block w-max hover:opacity-70 transition-opacity">
                                <UserIdentityCell
                                  initials={user.initials}
                                  name={user.name}
                                  email={user.phone}
                                  avatarVariant={user.avatarVariant}
                                  avatarUrl={user.avatarUrl}
                                />
                              </Link>
                            </td>
                            <td className="px-8 py-5">
                              <StatusBadge variant={user.gender}>
                                {user.gender === 'male' ? 'Male' : 'Female'}
                              </StatusBadge>
                            </td>
                            <td className="px-8 py-5 text-sm text-ink-2 font-medium">{user.joinDate}</td>
                            <td className="px-8 py-5 text-sm font-black text-ink">{user.age}</td>
                            <td className="px-8 py-5">
                              <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <Link
                                to={profilePath}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-2 hover:bg-ember/10 hover:text-ember transition-all"
                              >
                                <MaterialIcon name="visibility" className="!text-[20px]" />
                              </Link>
                            </td>
                          </motion.tr>
                        )
                      })
                    ) : (
                      <motion.tr key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td colSpan={TABLE_COLUMNS.length} className="py-32 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-canvas-sunk rounded-full flex items-center justify-center">
                              <MaterialIcon name="person_off" className="!text-[40px] text-ink-2/20" />
                            </div>
                            <div>
                              <p className="text-xl font-black text-ink">No users found</p>
                              <p className="text-sm text-ink-2">Try a different search term or clear filters</p>
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
        )}
      </div>
    </PageContainer>
  )
}
