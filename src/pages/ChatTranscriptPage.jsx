import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useFilteredData } from '../hooks/useFilteredData';
import { Reveal } from '../components/motion/primitives';
import { LoadingBar } from '../components/motion/Placeholder';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { adminApi } from '../lib/adminApi';
import { shortId } from '../lib/utils';

function computeDuration(startedAt, endedAt) {
  if (!startedAt || !endedAt) return '—'
  const ms = new Date(endedAt) - new Date(startedAt)
  if (ms <= 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return hrs > 0 ? `${hrs}h ${remMins}m` : `${mins}:${String(secs).padStart(2, '0')}`
}

async function fetchChatSessions() {
  const data = await adminApi('chatSessions')

  return (data || []).map(s => ({
    id: s.id,
    shortId: shortId(s.id),
    host: s.male_user?.name || 'Unknown',
    hostId: s.male_id,
    guest: s.female_user?.name || 'Unknown',
    guestId: s.female_id,
    status: s.status,
    date: s.started_at,
    startedAt: s.started_at,
    endedAt: s.ended_at,
    duration: computeDuration(s.started_at, s.ended_at),
  }))
}

export function ChatTranscriptPage() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const { data: sessions, loading } = useAdminQuery(fetchChatSessions);

  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(sessions || [], {
    searchFields: ['id', 'shortId', 'host', 'guest', 'hostId', 'guestId'],
    initialFilters: {
      id: '',
      status: '',
      hostName: '',
      userId: '',
      userName: '',
      dateRange: '',
      startDate: '',
      endDate: '',
    },
  });

  const options = useMemo(() => ({
    chatIds: [...new Set((sessions || []).map(d => d.shortId))].sort(),
    hosts: [...new Set((sessions || []).map(d => d.host))].sort(),
    users: [...new Set((sessions || []).map(d => d.guest))].sort(),
    userIds: [...new Set((sessions || []).map(d => d.guestId))].sort(),
    statuses: ['All', 'completed', 'active', 'rejected', 'ended'],
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Date'],
  }), [sessions]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const handleRowClick = (id) => {
    navigate(`/transcript/${id}`);
  };

  const STATUS_BORDER = {
    ended: 'border-l-4 border-l-good',
    active: 'border-l-4 border-l-info',
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-shell space-y-5 above-grain">
        <LoadingBar active={loading} />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Chat Transcripts</h1>
              <p className="mt-1 text-body text-ink-2">
                Completed sessions available for moderation review
              </p>
            </div>
          </div>
        </Reveal>

        {/* Header & Search Section */}
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <div className="relative flex-1 w-full max-w-2xl mx-auto md:mx-0">
            <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 !text-[24px]" />
            <input
              type="text"
              className="w-full rounded-well border border-hairline bg-card py-3.5 pl-12 pr-4 text-body text-ink shadow-card outline-none transition-all placeholder:text-ink-3 focus:border-ember focus:ring-2 focus:ring-ember-soft"
              placeholder="Search by Chat ID, participant name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-primary relative shrink-0 px-5 py-3"
          >
            <MaterialIcon name="tune" className="!text-[20px]" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="h-2.5 w-2.5 rounded-full bg-ember ring-2 ring-card" />
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <FilterPanel isOpen={showFilters} onReset={resetFilters}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SearchableSelect
              label="Chat ID"
              options={options.chatIds}
              value={filters.id}
              onChange={(val) => updateFilter('id', val)}
              placeholder="Any Chat ID"
              icon="tag"
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
              label="Host Name"
              options={options.hosts}
              value={filters.hostName}
              onChange={(val) => updateFilter('hostName', val)}
              placeholder="Any Host"
              icon="person"
            />
            <SearchableSelect
              label="User Name"
              options={options.users}
              value={filters.userName}
              onChange={(val) => updateFilter('userName', val)}
              placeholder="Any User"
              icon="account_circle"
            />
            <SearchableSelect
              label="User ID"
              options={options.userIds}
              value={filters.userId}
              onChange={(val) => updateFilter('userId', val)}
              placeholder="Any User ID"
              icon="badge"
            />
            <SearchableSelect
              label="Date Range"
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-hairline/50 mt-6"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-2/70 ml-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 !text-[20px]" />
                    <input
                      type="date"
                      className="w-full rounded-well border border-hairline bg-canvas-sunk py-3 pl-12 pr-4 text-body font-medium text-ink outline-none transition-all placeholder:text-ink-3 focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
                      value={filters.startDate}
                      onChange={(e) => updateFilter('startDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-2/70 ml-1">
                    End Date
                  </label>
                  <div className="relative">
                    <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 !text-[20px]" />
                    <input
                      type="date"
                      className="w-full rounded-well border border-hairline bg-canvas-sunk py-3 pl-12 pr-4 text-body font-medium text-ink outline-none transition-all placeholder:text-ink-3 focus:border-ember focus:bg-card focus:ring-2 focus:ring-ember-soft"
                      value={filters.endDate}
                      onChange={(e) => updateFilter('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FilterPanel>

        {/* Results List */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card h-20 shimmer-bar" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredResults.length > 0 ? (
                filteredResults.map((row) => (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleRowClick(row.id)}
                    className={`card card-interactive group p-5 ${STATUS_BORDER[row.status] ?? ''}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-ember/10 flex items-center justify-center text-ember">
                          <MaterialIcon name="chat_bubble" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-ink">#{row.shortId}</span>
                            <StatusBadge variant={row.status}>{row.status}</StatusBadge>
                          </div>
                          <p className="text-sm text-ink-2 font-medium">
                            {row.host} &amp; {row.guest}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-black text-ink-2 uppercase tracking-widest">
                            {row.startedAt ? new Date(row.startedAt).toLocaleDateString('en-IN') : '—'}
                          </p>
                          <p className="text-sm font-bold text-ink">{row.duration}</p>
                        </div>
                        <MaterialIcon name="chevron_right" className="text-ink-3 group-hover:text-ember transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 bg-canvas-sunk rounded-full flex items-center justify-center mb-4">
                    <MaterialIcon name="search_off" className="text-ink-2/40 !text-[32px]" />
                  </div>
                  <h3 className="text-xl font-black text-ink">No results found</h3>
                  <p className="text-ink-2">Try searching for a different ID or participant</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
