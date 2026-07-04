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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-surface rounded-2xl shadow-card px-6 py-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 !text-[22px]" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                placeholder="Search users by name, phone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all bg-primary text-on-primary shadow-lg shadow-accent-glow hover:bg-primary/90 shrink-0"
            >
              <MaterialIcon name="tune" className="!text-[20px]" />
              <span>Filter</span>
              {hasActiveFilters && <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse border-2 border-white" />}
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
          <div className="h-64 bg-surface rounded-2xl shadow-card animate-pulse" />
        ) : (
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
                            className="hover:bg-surface-container-low transition-colors group"
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
                            <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{user.joinDate}</td>
                            <td className="px-8 py-5 text-sm font-black text-on-surface">{user.age}</td>
                            <td className="px-8 py-5">
                              <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
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
                        )
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
                              <p className="text-sm text-on-surface-variant">Try a different search term or clear filters</p>
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
