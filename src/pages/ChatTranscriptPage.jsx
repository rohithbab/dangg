import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ChatFiltersPanel } from '../components/ui/ChatFiltersPanel';
import { useDataFilter } from '../hooks/useDataFilter';

const TRANSCRIPT_DATA = [
  {
    id: '#CHT-482',
    title: 'Alexander Grant & Elena Vance',
    subtitle: 'Standard Support Session',
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

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  } = useDataFilter(TRANSCRIPT_DATA, {
    searchFields: ['id', 'title', 'subtitle'],
    initialFilters: { status: 'All', id: '' },
    initialSort: { field: 'date', direction: 'desc' },
  });

  const handleCardClick = (id) => {
    // Extract numeric ID from #CHT-482 style or use as is
    const chatId = id.replace('#', '');
    navigate(`/transcript/${chatId}`);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'resolved';
      case 'escalated': return 'escalated';
      case 'archived': return 'archived';
      default: return 'archived';
    }
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Filter & Search Bar Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
              placeholder="Search by ID or Participant name..."
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
              <MaterialIcon name="filter_list" className="!text-[18px]" />
              <span>Filter</span>
              {(filters.id || filters.status !== 'All') && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
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
                showStatusFilter={true}
                statusOptions={['Resolved', 'Escalated', 'Archived']}
                showChatIdFilter={true}
                showDateFilter={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript List Container */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCardClick(row.id)}
                  className="glass-card border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="px-3 py-1.5 bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md tracking-wider">
                      {row.id}
                    </div>
                    
                    <div className="flex items-center gap-3 min-w-[300px]">
                      <div className="flex -space-x-3">
                        <img
                          src={row.participant1Avatar}
                          alt="Participant"
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                        <img
                          src={row.participant2Avatar}
                          alt="Participant"
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-headline-md text-body-lg font-semibold text-on-surface">
                          {row.title}
                        </p>
                        <p className="text-label-sm text-on-surface-variant">
                          {row.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MaterialIcon name="event" className="!text-[18px]" />
                      <span className="font-body-md text-body-md">{row.date}</span>
                      <span className="mx-2 text-outline-variant">•</span>
                      <MaterialIcon name="schedule" className="!text-[18px]" />
                      <span className="font-body-md text-body-md">{row.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-4">
                      <StatusBadge variant={getStatusVariant(row.status)} size="sm">
                        {row.status}
                      </StatusBadge>
                      <span className="text-[11px] text-on-surface-variant mt-1">
                        {row.messages} Messages
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                      <MaterialIcon name="arrow_forward" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
                <MaterialIcon name="search_off" className="!text-5xl text-outline-variant mb-4" />
                <h3 className="type-title-lg text-on-surface">No transcripts found</h3>
                <p className="text-on-surface-variant mt-2">Try searching for a different Chat ID or participant name.</p>
                <button onClick={resetFilters} className="mt-6 btn-primary px-8">Reset All Filters</button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-6">
          <p className="text-body-md text-on-surface-variant">
            Showing 1 to {filteredData.length} of {TRANSCRIPT_DATA.length} transcripts
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-md hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold">1</button>
              <button className="w-10 h-10 rounded-lg bg-white border border-outline-variant hover:bg-surface-container-low transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg bg-white border border-outline-variant hover:bg-surface-container-low transition-colors">3</button>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <button className="w-10 h-10 rounded-lg bg-white border border-outline-variant hover:bg-surface-container-low transition-colors">50</button>
            </div>
            <button className="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-md hover:bg-surface-container-low transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
