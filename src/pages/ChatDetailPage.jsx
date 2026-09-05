import { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
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

const PLACEHOLDER_AVATAR = 'https://placehold.co/96x96/e2e8f0/64748b?text=U';

async function fetchCompletedSessions() {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(`
      id, status, started_at, ended_at, male_id, female_id,
      male_user:users!male_id (name, profile_picture_url),
      female_user:users!female_id (name, profile_picture_url)
    `)
    .order('started_at', { ascending: false })
    .limit(100)

  if (error) throw error

  return (data || []).map(s => ({
    id: s.id,
    shortId: shortId(s.id),
    title: `${s.male_user?.name || 'Male'} & ${s.female_user?.name || 'Female'}`,
    host: s.male_user?.name || 'Unknown',
    hostId: s.male_id,
    guest: s.female_user?.name || 'Unknown',
    guestId: s.female_id,
    hostAvatar: s.male_user?.profile_picture_url || PLACEHOLDER_AVATAR,
    guestAvatar: s.female_user?.profile_picture_url || PLACEHOLDER_AVATAR,
    status: s.status,
    date: s.started_at,
    startedAt: s.started_at,
    endedAt: s.ended_at,
    duration: computeDuration(s.started_at, s.ended_at),
  }))
}

export function ChatDetailPage() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { data: sessions, loading } = useAdminQuery(fetchCompletedSessions);

  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(sessions || [], {
    searchFields: ['id', 'shortId', 'title', 'host', 'hostId', 'guest', 'guestId'],
    initialFilters: {
      id: '',
      hostName: '',
      userName: '',
      userId: '',
      dateRange: '',
      startDate: '',
      endDate: '',
    },
  });

  const options = useMemo(() => ({
    chatIds: [...new Set((sessions || []).map(s => s.shortId))].sort(),
    hosts: [...new Set((sessions || []).map(s => s.host))].sort(),
    users: [...new Set((sessions || []).map(s => s.guest))].sort(),
    userIds: [...new Set((sessions || []).map(s => s.guestId))].sort(),
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Date'],
  }), [sessions]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDetails = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleViewChat = (sessionId) => {
    navigate(`/transcript/${sessionId}`);
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-shell space-y-5 above-grain">
        <LoadingBar active={loading} />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Chat Sessions</h1>
              <p className="mt-1 text-body text-ink-2">
                Session records with replay and transcript access
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
              placeholder="Search by ID, title, host, or user..."
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

        {/* Results Grid */}
        <section className="min-h-[400px] relative">
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 bg-card rounded-2xl border border-hairline" />
              ))}
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {!loading && filteredResults.length > 0 ? (
              <div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredResults.map((session) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white border border-hairline rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    {/* Session Header */}
                    <div className="p-5 border-b border-hairline bg-canvas-sunkest flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ember/10 flex items-center justify-center text-ember">
                          <MaterialIcon name="history" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-ink-2 uppercase tracking-widest">#{session.shortId}</p>
                          <p className="text-sm font-bold text-ink line-clamp-1">{session.title}</p>
                        </div>
                      </div>
                      <StatusBadge variant={session.status}>{session.status}</StatusBadge>
                    </div>

                    {/* Participants */}
                    <div className="p-5 space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={session.hostAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" alt="" />
                          <div>
                            <p className="text-xs font-bold text-ink-2 uppercase">Host</p>
                            <p className="text-sm font-black text-ink">{session.host}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="text-xs font-bold text-ink-2 uppercase">User</p>
                            <p className="text-sm font-black text-ink">{session.guest}</p>
                          </div>
                          <img src={session.guestAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/20" alt="" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-hairline/50">
                        <div>
                          <p className="text-[10px] font-black text-ink-2 uppercase tracking-tighter">Duration</p>
                          <p className="text-sm font-bold text-ink">{session.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-ink-2 uppercase tracking-tighter">Date</p>
                          <p className="text-sm font-bold text-ink">
                            {session.startedAt ? new Date(session.startedAt).toLocaleDateString('en-IN') : '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 bg-canvas-sunk flex gap-2">
                      <button
                        onClick={() => handleOpenDetails(session)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white border border-hairline text-ink hover:bg-canvas-sunk-highest transition-all"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleViewChat(session.id)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-ink text-ink-inverse shadow-md hover:shadow-lg hover:bg-ember/90 transition-all"
                      >
                        Replay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : !loading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 bg-canvas-sunk rounded-full flex items-center justify-center mb-6">
                  <MaterialIcon name="history_toggle_off" className="!text-[40px] text-ink-2/30" />
                </div>
                <h3 className="text-2xl font-black text-ink">No sessions found</h3>
                <p className="text-ink-2 max-w-xs">We couldn't find any sessions matching your search.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>

      {/* Modal Overlay for Detail Display */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-base w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-canvas-sunk-highest/50 hover:bg-canvas-sunk-highest text-ink-2 transition-all hover:rotate-90"
            >
              <MaterialIcon name="close" />
            </button>

            <div className="p-12">
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-ember bg-ember-container px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                  Session Details
                </span>
                <h2 className="text-3xl font-black text-ink">{selectedSession.title}</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                <div className="flex-1 flex flex-col items-center text-center">
                  <img src={selectedSession.hostAvatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover mb-4" alt="" />
                  <h3 className="text-xl font-bold text-ink">{selectedSession.host}</h3>
                  <p className="text-xs font-bold text-ink-2 uppercase tracking-widest">Host</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-20 w-px bg-hairline"></div>
                  <div className="bg-canvas-sunk-highest px-6 py-4 rounded-2xl flex flex-col items-center border border-hairline/20">
                    <MaterialIcon name="schedule" className="text-ember mb-1" />
                    <span className="text-[10px] font-bold text-ink-2 uppercase tracking-tighter">Duration</span>
                    <span className="text-lg font-black text-ember">{selectedSession.duration}</span>
                  </div>
                  <div className="h-20 w-px bg-hairline"></div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center">
                  <img src={selectedSession.guestAvatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover mb-4" alt="" />
                  <h3 className="text-xl font-bold text-ink">{selectedSession.guest}</h3>
                  <p className="text-xs font-bold text-ink-2 uppercase tracking-widest">Guest</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={() => handleViewChat(selectedSession.id)} className="bg-ink text-ink-inverse px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-ember hover:scale-105 transition-transform active:scale-95">
                  <MaterialIcon name="visibility" />
                  <span>View Transcript</span>
                </button>
              </div>
            </div>

            <div className="bg-canvas-sunk/50 border-t border-hairline/10 p-8 flex justify-around">
              <div className="text-center">
                <p className="text-xs font-bold text-ink-2 uppercase tracking-tight mb-1">Duration</p>
                <p className="text-xl font-black text-ink">{selectedSession.duration}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-ink-2 uppercase tracking-tight mb-1">Status</p>
                <p className="text-xl font-black text-emerald-600 capitalize">{selectedSession.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
