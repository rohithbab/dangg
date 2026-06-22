import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchableSelect, FilterPanel } from '../components/ui';
import { useFilteredData } from '../hooks/useFilteredData';

const TRANSCRIPT_DATA = [
  {
    id: '#CHT-482',
    title: 'Alexander Grant & Elena Vance',
    subtitle: 'Standard Support Session',
    host: 'Alexander Grant',
    hostId: 'USR-1001',
    guest: 'Elena Vance',
    guestId: 'USR-2001',
    participant1Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVeSU2Qpc_FaVRNGfY3P8zusE--Onz52eP5tvGqKyUVcKWL7Zo3NS2ADlYXHbDy3ONCm1zU8eXHW-V9g5kbZukqXWbLXRl3ux6aB4TtTU7ebqjAxtN_6QgbBOyyDtIKWxK8wvERxDZt_-q8LHHTukhuG_m3ag85RnAEsv6mhvvStmQLyEAEj7XjaIemYAX9RVHEIV5l_HMelhrhMlTWcqfU4mVoYVrcYeYv_9kKt52pbXDyQJNWTVCIEc-zdcqtMhWxs5Tu7etvTs',
    participant2Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAve3Ge8IDarxdVLiKNIskt8DaPkG3tYG_e5226Lq2msXv9rU9jZAG_oDdLeh5iaisTI7U50-kNvAiDHanPefYELGiWDY9Xk0tDFk5Fvj_-r7QHsjIeS19ruvNhIYutj483tbFYm1B2m7pF4KS83rbikSImco_eMz8USO84s_HFZksokiRyM-9r3yP6DHUELR3ilaXe2nKK44icQpTMRbZn3sO9vMxQrX_Xh3XULCCh4MEFu_H0G2vlt8Jgh_uyfkJ_9OY3EjFuGBM',
    status: 'Resolved',
    date: 'Oct 24, 2023',
    time: '14:22 PM',
    messages: 12,
  },
  {
    id: '#CHT-481',
    title: 'Jameson Miller & Sarah Connor',
    subtitle: 'Billing Inquiry',
    host: 'Jameson Miller',
    hostId: 'USR-1002',
    guest: 'Sarah Connor',
    guestId: 'USR-2002',
    participant1Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm0UQlw-il5VhNfGUZ9BkrG3sAHmDL1PleRdLZarrw3W3AKF37GT2HrS9di7zgWupj_CZWNPQwCoUDcoqZdbv2mDiHayxgANmHqp9R6ZHHpCtyg_c9-8PZkSjdj0QwaeBYI9DU5dTCcBJP3UtnnfaLjw5GFT9-T3bCXkS0lhduwoo_Jd6S-RwOTQCax97er8shwdg6gO7oKRvr8boxrnTgSMuZhpzVZdw23GTOEuMgItSpkhndJc_iVaIMjt7E2T0GDVyRhApF3_k',
    participant2Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACjzzFGEndZ1qo71KDDb7bDmca5Fqfn5t259LT3YJ8-NusNpvJJdbbPNx3yw1kJBPu_KKyIhGZ1ETy553bSmD8H2B0NQaol91qLaTl9sd4KHb907YhpE7G3gX2-qd9EcCrx-o6Gnl4c-EO5PRqvAJ4Si-50emTX_Vv58hCSeGmeB5kWilmH1QpfxJsDuFpq2185zBE67daeA8qsRafMDNMT9Ywbd_CUMsFcqQ3bAVAVV8VZyOjQ10e2U6hGyLy_mOmXIhTdSqrg8g',
    status: 'Escalated',
    date: 'Oct 24, 2023',
    time: '11:05 AM',
    messages: 45,
  },
  {
    id: '#CHT-480',
    title: 'Daniel Ricciardo & Maya Lin',
    subtitle: 'Technical Integration',
    host: 'Daniel Ricciardo',
    hostId: 'USR-1003',
    guest: 'Maya Lin',
    guestId: 'USR-2003',
    participant1Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTwUhVQMAR-dMNCHlgaDQfkq9mZm3559uMGzE7Ms1EOhEl3W7cz8qqBZndvFD7xGP4_ySYw9yZnXfj4x6T0LnaVRJGu44i5vNQtRdNue4vCp5Yzy3OyPkcdxQhn-6plWeYQTyjK1CT_cRlmCPlURm-JgM2kecsMpBlexRuCGDia8TAEaQTKEDzopq517ON7eaK_gT3mXNbkONxIiVhr1bH3OwjfehLjXpTO_Mi9FJvh4ytA-o-BW6G0-Y2WibYbnhwsme-yfXxbsg',
    participant2Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC39Fu-nQNsKg1adyb-S1S0zbtniKUIzZWp0Em7W4Nn2l0CwyaaNhMqOB0zdoLfv7bIVQoTAkOxuHEMjkoBJFt50xwgcXp_rwmGeLULV71nDnuDsITjc5WblvhQrsLdckTyzvmdIaFpTvJgPT817Wu_pPdnTK_WmICZKW0Vdlw1r-AQ49VBm2h0x1VLttvGZGMM0uxw1ReKEezJ4kg_Np0sUR8E41PC4407qMwBSqdMoOvGSTfwjrYabda5HABQLosTm1Gsi9lp0TE',
    status: 'Resolved',
    date: 'Oct 23, 2023',
    time: '09:15 AM',
    messages: 8,
  },
  {
    id: '#CHT-479',
    title: 'Robert Lewis & Patricia Bright',
    subtitle: 'Account Recovery',
    host: 'Robert Lewis',
    hostId: 'USR-1004',
    guest: 'Patricia Bright',
    guestId: 'USR-2004',
    participant1Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ooj2p_tmOeDFNfodvdB0IhHZIhHbmOUN7XUM3uwUKJ-gw3bhf9jfZ1DgFrjjuaGPV6-hynIZfojPFhVcnjROggX2u6DGGPk3Z91Dqbj2J_RtaOiY4pD1X1obY3WvJLywZHrtK-J5Wwxa4OP_waNPi5eD06EdGUAa9j5qwn8ta4jS_dv6tBOa789yklt65MZW2NAfWi620ar5fRX7z2Zi4bzuhZCGZ4MnRqY44nUby2qSyxj4820rHB-n-acy2Broqm7xShpBJ3k',
    participant2Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSrCdLjnOhWB8QJkEkjGuAiCSty6Nwy8kEdnWUGS5z3hiKf4QAF9-SzL_soHn7Vzuuf965MLg2SVvX9AV1PXIS64bep0fEbNrAQo2uZcl89iBITfp1KpIxPR-WS42HyCBfv4Ef_v-uheAVcwsBaR2_GhxjEBI3DpXH80msIh2XFK5H1JjhejAr2GZUO8qseZw_q5On2qLUhLdoi-sJx_KXlbtoo__Hd-24l1x1EOX2zGa4ql6wGatQX-3nYjQ0RPZcTShrtpo2c5Y',
    status: 'Archived',
    date: 'Oct 23, 2023',
    time: '17:40 PM',
    messages: 21,
  },
  {
    id: '#CHT-478',
    title: 'Ethan Hunt & Ilsa Faust',
    subtitle: 'General Feedback',
    host: 'Ethan Hunt',
    hostId: 'USR-1005',
    guest: 'Ilsa Faust',
    guestId: 'USR-2005',
    participant1Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1C-12ewKqW8e7zafM3yiA0pZsODI5Fkil2f3IHGj3W333mjbdKh27r_63iFb3O87G5Xtb6KQOPvtuqFSl-PDEv08zVngv4T4BGxggi1vVfcNKAxFjzKP24WGpsq1AKtx60HJ-Q6Ny7ptf2L1FdkWqvUZ97RuFdHcLMAzLVnIfWfKwgEq4ALTdaPYHlAMtY5tBb7DT494M-vtZZ5K0_8rJ79I-L5K17suLFLbbNDIXYAb5tJiwSpjBlFKbQPRhH5uPw1uUU3ozGc4',
    participant2Avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOuEqHsSHualUoti9zRFcYIrs59pbnWUVEq1laJXMLOfMDE9VdDzJYAKyN-kga--i5-NgPaN1KwzGuk36jxGmsDzdEtSUnmduw70WUdawintwXW3WscpI-iXC7-Qy30fIB4NVM3Dky191hVyQLaymdUX6caaAcfvSe2HbgyfU_y2ISfIqwz2p9CH-46n5CWWo7RXKL7EwsraIZ_3DfpRJ-Ampi-7s40NEXS1WslaP52XlSlCFrrf9PGB0q97iiyRXJyMQQrbd-JdM',
    status: 'Resolved',
    date: 'Oct 22, 2023',
    time: '13:10 PM',
    messages: 4,
  },
];

export function ChatTranscriptPage() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // New filtering hook usage
  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useFilteredData(TRANSCRIPT_DATA, {
    searchFields: ['id', 'host', 'guest', 'hostId', 'guestId'],
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

  // Unique options for dropdowns
  const options = useMemo(() => ({
    chatIds: [...new Set(TRANSCRIPT_DATA.map(d => d.id))].sort(),
    hosts: [...new Set(TRANSCRIPT_DATA.map(d => d.host))].sort(),
    users: [...new Set(TRANSCRIPT_DATA.map(d => d.guest))].sort(),
    userIds: [...new Set(TRANSCRIPT_DATA.map(d => d.guestId))].sort(),
    statuses: ['All', 'Resolved', 'Escalated', 'Archived'],
    dateRanges: ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Date'],
  }), []);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const handleRowClick = (id) => {
    navigate(`/transcript/${id.replace('#', '')}`);
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
              placeholder="Search by Chat ID, participant name or ID..."
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

        {/* Results List */}
        <div className="flex flex-col gap-4 min-h-[400px]">
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
                  className="bg-white border border-outline-variant rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <MaterialIcon name="chat_bubble" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-on-surface">{row.id}</span>
                          <StatusBadge variant={row.status.toLowerCase()}>{row.status}</StatusBadge>
                        </div>
                        <p className="text-sm text-on-surface-variant font-medium">
                          {row.host} & {row.guest}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{row.date}</p>
                        <p className="text-sm font-bold text-on-surface">{row.time}</p>
                      </div>
                      <MaterialIcon name="chevron_right" className="text-outline group-hover:text-primary transition-colors" />
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
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <MaterialIcon name="search_off" className="text-on-surface-variant/40 !text-[32px]" />
                </div>
                <h3 className="text-xl font-black text-on-surface">No results found</h3>
                <p className="text-on-surface-variant">Try searching for a different ID or participant</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
