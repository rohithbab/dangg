import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Divider } from '../components/ui/Divider';
import { ChatFiltersPanel } from '../components/ui/ChatFiltersPanel';
import { useDataFilter } from '../hooks/useDataFilter';

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

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useDataFilter(COMPLETED_SESSIONS, {
    searchFields: ['id', 'title', 'host', 'hostId', 'guest', 'guestId'],
    initialFilters: { dateRange: { type: 'all' }, id: '' },
    initialSort: { field: 'date', direction: 'desc' },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDetails = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
  };

  const handleDeleteHistory = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this support session history forever? This action cannot be undone.'
      )
    ) {
      setIsModalOpen(false);
      alert(`History for session ${id} deleted.`);
    }
  };

  const handleViewChat = () => {
    navigate('/transcript/1');
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Filter & Search Bar Area - Simplified to match Stitch style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
              placeholder="Search hosts, guests, names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-md hover:bg-surface-container-low transition-colors ${
                showFilters ? 'bg-primary/5 border-primary text-primary' : ''
              }`}
            >
              <MaterialIcon name="tune" className="!text-[18px]" />
              <span>Quick Filter</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <ChatFiltersPanel 
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                showStatusFilter={false}
                showChatIdFilter={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid of Completed Chat Cards */}
        <section className="min-h-[400px]">
          <AnimatePresence>
            {filteredData.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredData.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleOpenDetails(session)}
                    className="glass-card border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex -space-x-2">
                          <img
                            src={session.hostAvatar}
                            alt={session.host}
                            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                          />
                          <img
                            src={session.guestAvatar}
                            alt={session.guest}
                            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                          />
                        </div>
                        <StatusBadge variant="resolved" size="sm">
                          Completed
                        </StatusBadge>
                      </div>
                      <h3 className="type-headline-sm font-bold mb-1 text-on-surface group-hover:text-primary transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-xs text-primary font-bold mb-3 uppercase tracking-widest">{session.id}</p>
                      <p className="text-sm text-on-surface-variant mb-4">
                        Host: <span className="font-semibold text-on-surface">{session.host}</span><br />
                        Guest: <span className="font-semibold text-on-surface">{session.guest}</span>
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant/60 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="calendar_today" className="!text-[16px] text-outline" />
                        {session.date}
                      </span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="schedule" className="!text-[16px] text-primary" />
                          {session.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="chat" className="!text-[16px] text-secondary" />
                          {session.messages}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <MaterialIcon name="search_off" className="!text-4xl text-outline-variant" />
                </div>
                <h3 className="type-headline-md text-on-surface">No sessions found</h3>
                <p className="type-body-md text-on-surface-variant mt-2">
                  Try adjusting your search terms or filters to find specific sessions.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-8 btn-primary rounded-xl px-8"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Modal Overlay for Detail Display */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/10 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="card-base w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseDetails}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface-variant transition-all hover:rotate-90"
              title="Close details"
            >
              <MaterialIcon name="close" />
            </button>

            {/* Modal Content */}
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-10">
                <span className="text-label-md font-label-md text-primary bg-primary-fixed px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Conversation Details
                </span>
                <h2 className="type-display text-on-surface font-extrabold">
                  {selectedSession.title}
                </h2>
              </div>

              {/* Comparison Grid */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                {/* Column Host (Male) */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-primary-container rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={selectedSession.hostAvatar}
                      alt={selectedSession.host}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg relative z-0 object-cover"
                    />
                    {selectedSession.hostVerified && (
                      <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full shadow-sm border border-outline-variant/10">
                        <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                          <MaterialIcon name="verified" className="text-primary !text-[14px]" />
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="type-headline-sm font-bold text-on-surface mb-1">{selectedSession.host}</h3>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
                    Host
                  </p>
                </div>

                {/* Session Duration Badge (Center) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-outline-variant to-transparent md:h-20 md:w-px"></div>
                  <div className="bg-surface-container-highest px-6 py-3 rounded-2xl flex flex-col items-center shadow-sm border border-outline-variant/20">
                    <MaterialIcon name="schedule" className="text-primary mb-1" />
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tighter">Duration</span>
                    <span className="type-headline-sm font-bold text-primary">{selectedSession.duration}</span>
                  </div>
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-outline-variant to-transparent md:h-20 md:w-px"></div>
                </div>

                {/* Column Guest (Female) */}
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-secondary-container rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={selectedSession.guestAvatar}
                      alt={selectedSession.guest}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg relative z-0 object-cover"
                    />
                    {selectedSession.guestPremium && (
                      <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full shadow-sm border border-outline-variant/10">
                        <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                          <MaterialIcon name="stars" className="text-secondary !text-[14px]" />
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="type-headline-sm font-bold text-on-surface mb-1">{selectedSession.guest}</h3>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
                    Guest
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleViewChat}
                  className="bg-primary-container hover:bg-primary text-on-primary-container px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  <MaterialIcon name="visibility" className="group-hover:scale-110 transition-transform" />
                  <span>View Chat</span>
                </button>
                <button
                  onClick={() => handleDeleteHistory(selectedSession.id)}
                  className="border border-outline-variant text-on-surface-variant hover:bg-surface-container-low px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <MaterialIcon name="delete_outline" className="group-hover:rotate-12 transition-transform" />
                  <span>Delete History</span>
                </button>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-surface-container-low/50 border-t border-outline-variant/10 p-6 flex justify-around items-center">
              <div className="flex flex-col items-center">
                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tight">Total Messages</span>
                <span className="type-headline-sm font-bold text-on-surface">{selectedSession.messages}</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tight">Safety Score</span>
                <span className="type-headline-sm font-bold text-emerald-600">{selectedSession.safetyScore}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
