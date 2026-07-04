import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useFilteredData } from '../hooks/useFilteredData';

const COMPLETED_SESSIONS = [
  {
    id: '#CHT-harmony',
    title: 'Pastel Harmony Session',
    host: 'Julian M.',
    hostId: 'USR-1029',
    guest: 'Elena R.',
    guestId: 'USR-2045',
    status: 'Completed',
    date: 'May 23, 2026',
    duration: '42:15',
    messages: 128,
    safetyScore: '9.8/10',
    hostAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsjtsFXy4HiwpA18wotAsbpSldoj0cMxbU6FyiTHXWTdTvXd7RA2v5KfH1MXirPJEpfQ_iQGrhRinkrllVfwf-HhqhTVheUyZx7_dDTp5GJ5yNVst0aUcijIRGiymqRnVtGuHHfXqu9VZPAnLBAPHvu2KRKOQ6FYZOcPHMHGWKg1lZbWgDe471Wkpr2eLRiqFbaC636DC0IIjSnu5PjZKKgL_vJ20vuNygQqqojWvRqVAmw4NGre9rEncFEisvfVuim1niPpKmm50',
    guestAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHVrImgb65P6IK4-CzpSQQ78pnCpXEuV3pKVAVK2SA4PLDwF7wM_mEBrc8xpEw8B01kuwYXfqaywfsxDMhPfpTJbTrwXHjdf4ML4LDwYjPDN4gK4xy9HG565m2hazCfAzGKEtT8UWCSyuvpNZ8gxz5rYzIYkqAovGZotbwTP4sdX6bmrI7oc-gzjPlAMHHw4i_53jI-bvWZfra3uNcLhnsGx3nDA77Qd9nP2YKf2xj9pihV_yWgn_iDUsTeBrFv2Z6qVULzhi34ZQ',
    hostVerified: true,
    guestPremium: true,
  },
  {
    id: '#CHT-technical',
    title: 'Technical Admin Support',
    host: 'Liam S.',
    hostId: 'USR-3001',
    guest: 'Sophia K.',
    guestId: 'USR-2046',
    status: 'Completed',
    date: 'May 22, 2026',
    duration: '18:32',
    messages: 45,
    safetyScore: '9.5/10',
    hostAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-jrA3i9nII5Cun9H-2Z5d9cqwCk-RS_KHTntrPOYXMAV6_UH6TEUVn7ElATppsAFZXyfvDD4mW3S8ytRL87rFUOardfB7tV9xjJ9qT2x6XZUjsd0ps-pEtfRlaoYDPO8D1uvzVecYYv-GoViHlVebJgPKRDmW0DneLPDrIvA3iWBEnLqyES2jhtAb9Q9FCWlXQVtG9ebed4IOE9tc8C3tnBGMsou15fBMH_UfCoZ7sCTNKkEp0DKAgrCKiK1bQN_yL71moXaJYhM',
    guestAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMLOW8Yrk_ulGkiRJuMR3tcbCwHU24mS9RmxRAUksnjQmUNZRZRGx0XZHOeDkCfy1LgY0HKyCg4RS6_PzT-2DEYjtxcKMo5vgmkKa1uNx4UUqK7awz7D-Mj5MC7Jxpcfxv5gayPmGLk6FpX2SDi2dazZ-WxocaxnuIgFoEzW6fOsILUSqEN4niqkMGF4Vj0x79X7EycJophXmuVSnibgnkKToWUb4zZ0r_ywnrRjxF31Lg68vLYiWb5x51Hpwe4YO5GYOytoEWJ24',
    hostVerified: true,
    guestPremium: false,
  },
  {
    id: '#CHT-revenue',
    title: 'Revenue Verification Query',
    host: 'Noah W.',
    hostId: 'USR-3002',
    guest: 'Olivia M.',
    guestId: 'USR-2045',
    status: 'Completed',
    date: 'May 15, 2026',
    duration: '29:45',
    messages: 82,
    safetyScore: '9.9/10',
    hostAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUj00C3KT5nSaEAlKpeljYwzdXdFBp_Jzu8fs76Q2pDyi7dWGAZtp8QL3pTTM6-LK8DLOx8ZDgQO0EmF69xck3hb2E2ViTfVcjvDVEtsij1laprpkzgju5KTPMNwyxMFXAdGnBDge8uy6Ev0EzcKnF1zaSVxxdK91G5p2vSJH0aO6RBU0C0rWTfsaH7w05gOL9LkMZviKVYuwZJcEmCWbhigBp5jdwiI3VQTO-6qvjSuLEUBquUexWL5nhwB292VQowMAVk5xmXTw',
    guestAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATGH8HWZrgoNSJRnvHbNZIVAK713m_e3vW-BNggJ0W0DSYISvOuXoENkItB6GhKxzaxWww6-pu8SdseG9P_JYDYAHefb0l1rp8sPOgUtsEfjmezwrLSYwPEir-cFOWYaOB7pArM5tXZyFNSSCiYvS1IHmRKcuGjjoljsCPJnTwkFfycy5OgaBsejFVOah0HR8xdIUjyVoHwUK3rqz5Hn_7xhsdyykydJJi5jrqh98K1NcdZJMKSgraJjIIA0eQz1jkNCtKzyUE3Pg',
    hostVerified: false,
    guestPremium: true,
  },
  {
    id: '#CHT-general',
    title: 'General Feedback Session',
    host: 'Mason T.',
    hostId: 'USR-1029',
    guest: 'Isabella G.',
    guestId: 'USR-2046',
    status: 'Completed',
    date: 'Apr 20, 2026',
    duration: '05:12',
    messages: 14,
    safetyScore: '9.2/10',
    hostAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlwbX_qgejOvGn8WVEz0iw1djsq_oEtitwXHVoRcYvR4Wwi1sdLFvvFH9jYw4ItBtXZaRisYrn6pGAyV1LCz-LhbA-ANSt9BKSbdmcTVwqrqyNtW4im_8urw20RSGAdocuX475YTAD284Tbj1aBLOW_TLiAxBSfDqWLat48QieL4wJgH8RulJtKF3XsGmWgn_oUhgW9LSc5NeXts0SQWTqrcrdAJH8szoj6Cnb3nZHnij61Y_tuvT3hPs4tvJeZYT9Hw4bGdxSims',
    guestAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOEmvT3L-7C3oNDB_zhNbIzRyvJP26h76UhK3uVai0dJwpkjjEEgZHJV5H0QlUzeyFfUi6w5PvKwRafp-Ktqx6WdazzHzjA0cuhwtdMrb7LFZnifGJve1D8OlORYBoJ9d6p6-5mfmyzKmpw9Y2emB3uFH62iOfqs_u2Tqyag7iRDJHqa93e3-gVAqQA625w-7mwh6eJC3dan_VE6vYc40sosH0uFFY2NRIAhPV0OWGFl76Opyw3hJUMrpZmfAay91h8b1Y53WPb3I',
    hostVerified: true,
    guestPremium: true,
  },
];

export function ChatDetailPage() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Rebuilt filtering hook usage
  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(COMPLETED_SESSIONS, {
    searchFields: ['id', 'title', 'host', 'hostId', 'guest', 'guestId'],
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

  // Unique options for dropdowns
  const options = useMemo(() => ({
    chatIds: [...new Set(COMPLETED_SESSIONS.map(s => s.id))].sort(),
    hosts: [...new Set(COMPLETED_SESSIONS.map(s => s.host))].sort(),
    users: [...new Set(COMPLETED_SESSIONS.map(s => s.guest))].sort(),
    userIds: [...new Set(COMPLETED_SESSIONS.map(s => s.guestId))].sort(),
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Date'],
  }), []);

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

  const handleViewChat = () => {
    navigate('/transcript/1');
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-2xl mx-auto md:mx-0">
            <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[24px]" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-body-lg shadow-sm"
              placeholder="Search by ID, title, host, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all bg-primary text-on-primary shadow-lg shadow-accent-glow hover:bg-primary/90"
          >
            <MaterialIcon name="tune" className="!text-[20px]" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse border-2 border-white" />
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-outline-variant/50 mt-6"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-on-surface"
                      value={filters.startDate}
                      onChange={(e) => updateFilter('startDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                    End Date
                  </label>
                  <div className="relative">
                    <MaterialIcon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-on-surface"
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
          <AnimatePresence mode="popLayout">
            {filteredResults.length > 0 ? (
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
                    className="bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    {/* Session Header */}
                    <div className="p-5 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <MaterialIcon name="history" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{session.id}</p>
                          <p className="text-sm font-bold text-on-surface line-clamp-1">{session.title}</p>
                        </div>
                      </div>
                      <StatusBadge variant="success">{session.status}</StatusBadge>
                    </div>

                    {/* Participants */}
                    <div className="p-5 space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={session.hostAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" alt="" />
                          <div>
                            <p className="text-xs font-bold text-on-surface-variant uppercase">Host</p>
                            <p className="text-sm font-black text-on-surface">{session.host}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="text-xs font-bold text-on-surface-variant uppercase">User</p>
                            <p className="text-sm font-black text-on-surface">{session.guest}</p>
                          </div>
                          <img src={session.guestAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/20" alt="" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/50">
                        <div>
                          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Duration</p>
                          <p className="text-sm font-bold text-on-surface">{session.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Messages</p>
                          <p className="text-sm font-bold text-on-surface">{session.messages}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 bg-surface-container-low flex gap-2">
                      <button 
                        onClick={() => handleOpenDetails(session)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white border border-outline-variant text-on-surface hover:bg-surface-container-highest transition-all"
                      >
                        Details
                      </button>
                      <button 
                        onClick={handleViewChat}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-primary text-on-primary shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
                      >
                        Replay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
                  <MaterialIcon name="history_toggle_off" className="!text-[40px] text-on-surface-variant/30" />
                </div>
                <h3 className="text-2xl font-black text-on-surface">No sessions found</h3>
                <p className="text-on-surface-variant max-w-xs">We couldn't find any completed sessions matching your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Modal Overlay for Detail Display */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-base w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface-variant transition-all hover:rotate-90"
            >
              <MaterialIcon name="close" />
            </button>

            <div className="p-12">
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-primary bg-primary-container px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                  Session Details
                </span>
                <h2 className="text-3xl font-black text-on-surface">{selectedSession.title}</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                <div className="flex-1 flex flex-col items-center text-center">
                  <img src={selectedSession.hostAvatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover mb-4" alt="" />
                  <h3 className="text-xl font-bold text-on-surface">{selectedSession.host}</h3>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Host</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-20 w-px bg-outline-variant"></div>
                  <div className="bg-surface-container-highest px-6 py-4 rounded-2xl flex flex-col items-center border border-outline-variant/20">
                    <MaterialIcon name="schedule" className="text-primary mb-1" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Duration</span>
                    <span className="text-lg font-black text-primary">{selectedSession.duration}</span>
                  </div>
                  <div className="h-20 w-px bg-outline-variant"></div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center">
                  <img src={selectedSession.guestAvatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover mb-4" alt="" />
                  <h3 className="text-xl font-bold text-on-surface">{selectedSession.guest}</h3>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Guest</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={handleViewChat} className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-accent-glow hover:scale-105 transition-transform active:scale-95">
                  <MaterialIcon name="visibility" />
                  <span>View Transcript</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low/50 border-t border-outline-variant/10 p-8 flex justify-around">
              <div className="text-center">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tight mb-1">Messages</p>
                <p className="text-xl font-black text-on-surface">{selectedSession.messages}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tight mb-1">Safety Score</p>
                <p className="text-xl font-black text-emerald-600">{selectedSession.safetyScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
