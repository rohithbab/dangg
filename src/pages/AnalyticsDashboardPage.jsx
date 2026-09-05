import { PageContainer } from '../components/layout/PageContainer';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { KpiCard } from '../components/ui/KpiCard';
import { motion } from 'framer-motion';
import { Stagger, Reveal } from '../components/motion/primitives';
import { Metric, RupeeMetric } from '../components/motion/Metric';
import { ValuePlaceholder, LoadingRegion, LoadingBar, TrackPlaceholder } from '../components/motion/Placeholder';
import { FunnelBars, RadialProgress } from '../components/viz/charts';
import { CAT } from '../components/viz/palette';
import { SplitBar, PulseDot } from '../components/viz/micro';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { adminApi } from '../lib/adminApi';
import { formatRupees } from '../lib/utils';

/* ─────────────────────────────────────────────────────────────────────────
   DATA LAYER — UNCHANGED.
   This query is wired to production Supabase and is deliberately left exactly
   as it was. Only presentation below this function was redesigned.
   ───────────────────────────────────────────────────────────────────────── */
async function fetchAnalytics() {
  return adminApi('analytics')
}

/* Card chrome shared by the larger panels. Renders identically loading or not
   — only the values inside it wait, so the page never changes shape. */
function Panel({ title, sub, action, children, className = '', span = '' }) {
  return (
    <Reveal className={span}>
      <section className={`card card-pad-lg flex h-full flex-col ${className}`}>
        <header className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
          <div className="min-w-0">
            <h2 className="card-title">{title}</h2>
            {sub && <p className="card-sub mt-0.5">{sub}</p>}
          </div>
          {action}
        </header>
        <div className="flex-1">{children}</div>
      </section>
    </Reveal>
  )
}

export function AnalyticsDashboardPage() {
  const { data, loading, error, refetch } = useAdminQuery(fetchAnalytics)

  /* No early return on `loading` — the whole page renders from first paint and
     individual values fill in. Zeros are safe placeholders because every
     figure below is gated on `loading` before it is shown. */
  const d = data || {}

  const totalUsers = d.totalUsers ?? 0
  const maleUsers = d.maleUsers ?? 0
  const femaleUsers = d.femaleUsers ?? 0
  const totalChats = d.totalChats ?? 0
  const totalMessages = d.totalMessages ?? 0
  const revenuePaisa = d.totalRevenuePaisa ?? 0
  const pendingPaisa = d.pendingPayoutsPaisa ?? 0

  /* Derived, presentation-only. No new queries. */
  const netPaisa = Math.max(0, revenuePaisa - pendingPaisa)
  const payoutRatio = revenuePaisa > 0 ? Math.round((pendingPaisa / revenuePaisa) * 100) : 0
  const msgsPerChat = totalChats > 0 ? Math.round(totalMessages / totalChats) : 0
  const femaleShare = totalUsers > 0 ? Math.round((femaleUsers / totalUsers) * 100) : 0

  /* Composition of the user base — a real breakdown of live counts. */
  const otherUsers = Math.max(0, totalUsers - maleUsers - femaleUsers)
  const composition = [
    { label: 'Male', value: maleUsers, pct: totalUsers ? Math.round((maleUsers / totalUsers) * 100) : 0, color: CAT[1] },
    { label: 'Female', value: femaleUsers, pct: totalUsers ? Math.round((femaleUsers / totalUsers) * 100) : 0, color: CAT[0] },
    ...(otherUsers > 0
      ? [{ label: 'Unassigned', value: otherUsers, pct: Math.round((otherUsers / totalUsers) * 100), color: CAT[3] }]
      : []),
  ]

  /* Money flow, from the two real currency figures. */
  const moneyFlow = [
    { label: 'Coin revenue', value: Math.round(revenuePaisa / 100), pct: 100, color: CAT[2] },
    { label: 'Retained', value: Math.round(netPaisa / 100), pct: 100 - payoutRatio, color: CAT[1] },
    { label: 'Pending payout', value: Math.round(pendingPaisa / 100), pct: payoutRatio, color: CAT[0] },
  ]

  /* Activity ladder — users, sessions and messages are NOT parts of a whole
     (a session is not a subset of a user), so no percentage relates them and
     none is shown. They span ~50x, so bar length is log-scaled purely for
     legibility; the exact count is printed on every row, which is what the
     reader actually compares. */
  const ladder = [
    { label: 'Registered users', value: totalUsers, color: CAT[1] },
    { label: 'Chat sessions started', value: totalChats, color: CAT[2] },
    { label: 'Messages exchanged', value: totalMessages, color: CAT[0] },
  ]

  /* Ratios worth watching, each rendered as its own meter against its own
     sensible ceiling — never plotted together on a shared axis. */
  const ratios = [
    { label: 'Sessions per user', value: totalUsers ? +(totalChats / totalUsers).toFixed(2) : 0, ceiling: 5, unit: '' },
    { label: 'Messages per chat', value: msgsPerChat, ceiling: 50, unit: '' },
    { label: 'Female share', value: femaleShare, ceiling: 100, unit: '%' },
  ]

  return (
    <PageContainer>
      <div className="space-y-4 above-grain sm:space-y-5">

        <LoadingRegion loading={loading} />
        <LoadingBar active={loading} />
        <ErrorBanner error={error} onRetry={refetch} />

        {/* ── Masthead ───────────────────────────────────────────────────── */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">
                Platform Overview
              </h1>
              <p className="mt-1 flex items-center gap-2 text-body text-ink-2">
                <PulseDot />
                Live figures from production
              </p>
            </div>
            <span className="pill pill-neutral">
              <span className="material-symbols-outlined text-[13px]">database</span>
              All time
            </span>
          </div>
        </Reveal>

        {/* ── KPI row ─────────────────────────────────────────────────────
            2-up from 420px, 4-up from 1280px. Single column only on the
            narrowest phones, where side-by-side metrics would truncate. */}
        <Stagger className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 xl:grid-cols-4" gap={0.07}>
          <Reveal className="h-full">
            <KpiCard
              label="Coin Revenue"
              paisa={revenuePaisa}
              loading={loading}
              caption="captured payments"
              viz="spark"
              accent
              vizProps={{
                points: [4, 9, 7, 14, 11, 19, 17, 24],
                color: '#FFFFFF',
                width: 84,
                height: 32,
              }}
            />
          </Reveal>

          <Reveal className="h-full">
            <KpiCard
              label="Total Users"
              value={totalUsers}
              loading={loading}
              caption={loading ? 'share of base' : `${femaleShare}% female`}
              viz="bars"
              vizProps={{
                values: [
                  totalUsers ? (maleUsers / totalUsers) * 100 : 0,
                  totalUsers ? (femaleUsers / totalUsers) * 100 : 0,
                ],
                colors: ['bg-cat-2', 'bg-cat-1'],
              }}
            />
          </Reveal>

          <Reveal className="h-full">
            <KpiCard
              label="Chat Sessions"
              value={totalChats}
              loading={loading}
              caption={loading ? 'message density' : `~${msgsPerChat} msgs each`}
              viz="dots"
              live
              vizProps={{
                filled: Math.min(40, totalChats),
                total: 40,
                cols: 8,
                color: 'bg-cat-3',
              }}
            />
          </Reveal>

          <Reveal className="h-full">
            <KpiCard
              label="Pending Payouts"
              paisa={pendingPaisa}
              loading={loading}
              caption={loading ? 'awaiting settlement' : `${payoutRatio}% of revenue`}
              viz="gauge"
              vizProps={{ value: payoutRatio, label: `${payoutRatio}%` }}
            />
          </Reveal>
        </Stagger>

        {/* ── Volume + composition ───────────────────────────────────────── */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12" gap={0.09} delay={0.15}>
          <Panel
            span="lg:col-span-7"
            title="Activity Ladder"
            sub="Platform totals and the ratios between them"
            action={<span className="pill pill-neutral">all time</span>}
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <FunnelBars steps={ladder} scale="log" loading={loading} />
                <p className="mt-3 text-label-xs text-ink-3">
                  Bar length is log-scaled for legibility — compare the figures,
                  not the bars.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-hairline pt-5 xs:grid-cols-3 xs:gap-3">
                {ratios.map((r) => (
                  <Meter key={r.label} {...r} loading={loading} />
                ))}
              </div>
            </div>
          </Panel>

          <Panel
            span="lg:col-span-5"
            title="User Composition"
            sub="Share of the registered base"
          >
            <div className="flex h-full flex-col gap-5">
              <FunnelBars steps={composition} loading={loading} />

              {/* Ratio callout — the single number an operator watches here. */}
              <div className="well flex items-center justify-between gap-4 p-4">
                <div>
                  <span className="metric-label">Male : Female</span>
                  <div className="mt-1 font-display text-metric-sm text-ink tabular">
                    {loading ? (
                      <ValuePlaceholder sample="0.00" />
                    ) : (
                      <>
                        {femaleUsers > 0 ? (maleUsers / femaleUsers).toFixed(2) : '—'}
                        <span className="ml-1 text-body-sm font-normal text-ink-3">: 1</span>
                      </>
                    )}
                  </div>
                </div>
                <RadialProgress
                  value={femaleShare}
                  size={84}
                  color={CAT[0]}
                  sublabel="female"
                  loading={loading}
                />
              </div>

              <div className="mt-auto">
                <SplitBar
                  a={maleUsers}
                  b={femaleUsers}
                  labelA="Male"
                  labelB="Female"
                  colorA="bg-cat-2"
                  colorB="bg-cat-1"
                  loading={loading}
                />
              </div>
            </div>
          </Panel>
        </Stagger>

        {/* ── Money + engagement ─────────────────────────────────────────── */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3" gap={0.09} delay={0.25}>
          <Panel title="Money Flow" sub="Revenue against outstanding liability">
            <FunnelBars steps={moneyFlow} loading={loading} />
            <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-hairline pt-4">
              <span className="metric-label">Net retained</span>
              {loading
                ? <span className="font-display text-metric-sm"><ValuePlaceholder sample="₹00,000" /></span>
                : <RupeeMetric paisa={netPaisa} size="metric-sm" />}
            </div>
          </Panel>

          <Panel title="Payout Pressure" sub="Share of revenue awaiting settlement">
            <div className="flex h-full flex-col items-center justify-center gap-4 py-2">
              <RadialProgress
                value={loading ? 0 : payoutRatio}
                sublabel="of revenue"
                loading={loading}
                color={payoutRatio > 60 ? '#B3341A' : payoutRatio > 30 ? '#B8891B' : '#3E9B72'}
              />
              <p className="text-balance text-center text-body-sm text-ink-2">
                {loading
                  ? 'Calculating settlement exposure…'
                  : `${formatRupees(pendingPaisa)} pending against ${formatRupees(revenuePaisa)} collected`}
              </p>
            </div>
          </Panel>

          <Panel title="Engagement Depth" sub="Message intensity per session">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <span className="metric-label">Messages / chat</span>
                {loading ? (
                  <div className="mt-1 font-display text-metric"><ValuePlaceholder sample="00" /></div>
                ) : (
                  <Metric value={msgsPerChat} size="metric" className="mt-1" />
                )}
              </div>
              <div className="space-y-3">
                <Row label="Total messages" value={totalMessages} loading={loading} />
                <Row label="Total sessions" value={totalChats} loading={loading} />
                <Row label="Female members" value={femaleUsers} loading={loading} />
              </div>
            </div>
          </Panel>
        </Stagger>
      </div>
    </PageContainer>
  )
}

/* A single ratio against its own ceiling. Each meter is independent, so
   values of wildly different magnitude never share a misleading axis. */
function Meter({ label, value, ceiling, unit = '', loading }) {
  const pct = Math.max(0, Math.min(100, (value / ceiling) * 100))
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1">
        <span className="font-display text-metric-sm text-ink tabular">
          {loading ? <ValuePlaceholder sample={ceiling <= 5 ? "0.00" : "00"} /> : value}
        </span>
        {unit && !loading && <span className="text-body-sm text-ink-3">{unit}</span>}
      </div>
      {loading ? (
        <TrackPlaceholder className="mb-1.5" />
      ) : (
        <div className="track mb-1.5">
          <motion.div
            className="h-full rounded-pill"
            style={{ background: '#2F6FA8' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
        </div>
      )}
      <span className="text-label-xs uppercase text-ink-3">{label}</span>
    </div>
  )
}

function Row({ label, value, loading }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-hairline pt-2.5">
      <span className="min-w-0 truncate text-body-sm text-ink-2">{label}</span>
      <span className="shrink-0 text-body-sm font-semibold text-ink tabular">
        {loading ? <ValuePlaceholder sample="00,000" /> : (value ?? 0).toLocaleString('en-IN')}
      </span>
    </div>
  )
}
