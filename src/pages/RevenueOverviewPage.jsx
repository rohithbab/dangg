import { PageContainer } from '../components/layout/PageContainer';
import { KpiCard } from '../components/ui/KpiCard';
import { Stagger, Reveal } from '../components/motion/primitives';
import { RupeeMetric, Metric } from '../components/motion/Metric';
import { ValuePlaceholder, LoadingRegion, LoadingBar } from '../components/motion/Placeholder';
import { FunnelBars, RadialProgress } from '../components/viz/charts';
import { CAT } from '../components/viz/palette';
import { PulseDot } from '../components/viz/micro';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatRupees } from '../lib/utils';

/* ─────────────────────────────────────────────────────────────────────────
   DATA LAYER — UNCHANGED.
   ───────────────────────────────────────────────────────────────────────── */
async function fetchRevenue() {
  const [
    { data: capturedPayments },
    { data: completedPayouts },
    { data: pendingPayouts },
    { data: femalesData },
    { count: femaleCount },
  ] = await Promise.all([
    supabase.from('payments').select('amount_paisa').eq('status', 'captured'),
    supabase.from('payouts').select('payout_amount_paisa').eq('status', 'completed'),
    /* 'processing' is NOT a member of the payout_status enum — including it
       made Postgres reject the query with 22P02. Verified 2026-09-05. */
    supabase.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'approved']),
    supabase.from('females').select('earnings_balance_coins').gt('earnings_balance_coins', 0),
    supabase.from('females').select('*', { count: 'exact', head: true }).gt('earnings_balance_coins', 0),
  ])

  const totalRevenuePaisa = (capturedPayments || []).reduce((s, p) => s + (p.amount_paisa || 0), 0)
  const completedPayoutsPaisa = (completedPayouts || []).reduce((s, p) => s + (p.payout_amount_paisa || 0), 0)
  const pendingPayoutsPaisa = (pendingPayouts || []).reduce((s, p) => s + (p.payout_amount_paisa || 0), 0)
  const totalFemaleCoins = (femalesData || []).reduce((s, f) => s + (f.earnings_balance_coins || 0), 0)
  const actualProfitPaisa = totalRevenuePaisa - completedPayoutsPaisa

  return {
    totalRevenuePaisa,
    completedPayoutsPaisa,
    actualProfitPaisa,
    pendingPayoutsPaisa,
    totalFemaleCoins,
    femaleCount: femaleCount || 0,
  }
}

function Panel({ title, sub, action, children, span = '' }) {
  return (
    <Reveal className={span}>
      <section className="card card-pad-lg flex h-full flex-col">
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

export function RevenueOverviewPage() {
  const { data, loading } = useAdminQuery(fetchRevenue)
  const d = data || {}

  const revenue = d.totalRevenuePaisa ?? 0
  const paidOut = d.completedPayoutsPaisa ?? 0
  const profit = Math.max(0, d.actualProfitPaisa ?? 0)
  const pending = d.pendingPayoutsPaisa ?? 0
  const coins = d.totalFemaleCoins ?? 0
  const earners = d.femaleCount ?? 0

  /* Derived, presentation only. */
  const marginPct = revenue > 0 ? Math.round((profit / revenue) * 100) : 0
  const paidPct = revenue > 0 ? Math.round((paidOut / revenue) * 100) : 0
  const liabilityPct = revenue > 0 ? Math.round((pending / revenue) * 100) : 0
  const avgCoins = earners > 0 ? Math.round(coins / earners) : 0

  /* A genuine part-to-whole: paid + retained = collected. */
  const split = [
    { label: 'Collected', value: Math.round(revenue / 100), pct: 100, color: CAT[2] },
    { label: 'Paid to creators', value: Math.round(paidOut / 100), pct: paidPct, color: CAT[1] },
    { label: 'Retained', value: Math.round(profit / 100), pct: marginPct, color: CAT[0] },
  ]

  return (
    <PageContainer>
      <div className="space-y-4 above-grain sm:space-y-5">
        <LoadingRegion loading={loading} label="Loading revenue data" />
        <LoadingBar active={loading} />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Revenue</h1>
              <p className="mt-1 flex items-center gap-2 text-body text-ink-2">
                <PulseDot />
                Collections, payouts and margin
              </p>
            </div>
            <span className="pill pill-neutral">
              <span className="material-symbols-outlined text-[13px]">database</span>
              All time
            </span>
          </div>
        </Reveal>

        {/* KPI row */}
        <Stagger className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 xl:grid-cols-4" gap={0.07}>
          <Reveal className="h-full">
            <KpiCard
              label="Total Revenue"
              paisa={revenue}
              loading={loading}
              caption="captured payments"
              viz="spark"
              accent
              vizProps={{ points: [5, 8, 7, 13, 12, 18, 22, 26], color: '#FFFFFF', width: 84, height: 32 }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Paid to Creators"
              paisa={paidOut}
              loading={loading}
              caption={loading ? 'settled payouts' : `${paidPct}% of revenue`}
              viz="gauge"
              vizProps={{ value: paidPct, label: `${paidPct}%` }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Retained"
              paisa={profit}
              loading={loading}
              caption={loading ? 'gross margin' : `${marginPct}% margin`}
              viz="bars"
              vizProps={{ values: [marginPct, paidPct], colors: ['bg-cat-3', 'bg-cat-2'] }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Pending Liability"
              paisa={pending}
              loading={loading}
              caption={loading ? 'awaiting settlement' : `${liabilityPct}% of revenue`}
              viz="dots"
              vizProps={{ filled: Math.min(40, Math.round(liabilityPct * 0.4)), total: 40, cols: 8, color: 'bg-cat-1' }}
            />
          </Reveal>
        </Stagger>

        {/* Split + margin */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12" gap={0.09} delay={0.15}>
          <Panel
            span="lg:col-span-7"
            title="Where the money went"
            sub="Collected revenue split between creators and the platform"
            action={<span className="pill pill-neutral">rupees</span>}
          >
            <FunnelBars steps={split} loading={loading} />
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-hairline pt-4">
              <div>
                <span className="metric-label">Gross margin</span>
                <div className="mt-1 font-display text-metric-sm text-ink tabular">
                  {loading ? <ValuePlaceholder sample="00" /> : `${marginPct}%`}
                </div>
              </div>
              <div>
                <span className="metric-label">Outstanding</span>
                <div className="mt-1">
                  {loading
                    ? <span className="font-display text-metric-sm"><ValuePlaceholder sample="₹00,000" /></span>
                    : <RupeeMetric paisa={pending} size="metric-sm" />}
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            span="lg:col-span-5"
            title="Margin"
            sub="Share of revenue the platform keeps"
          >
            <div className="flex h-full flex-col items-center justify-center gap-4 py-2">
              <RadialProgress
                value={marginPct}
                loading={loading}
                sublabel="retained"
                color={marginPct < 20 ? '#B3341A' : marginPct < 40 ? '#B8891B' : '#3E9B72'}
              />
              <p className="text-balance text-center text-body-sm text-ink-2">
                {loading
                  ? 'Calculating margin…'
                  : `${formatRupees(profit)} retained from ${formatRupees(revenue)} collected`}
              </p>
            </div>
          </Panel>
        </Stagger>

        {/* Creator wallet exposure */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2" gap={0.09} delay={0.25}>
          <Panel title="Creator Wallets" sub="Unwithdrawn coin balances held by creators">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="metric-label">Total coins held</span>
                {loading ? (
                  <div className="mt-1 font-display text-metric"><ValuePlaceholder sample="00,000" /></div>
                ) : (
                  <Metric value={coins} className="mt-1" />
                )}
              </div>
              <div className="text-right">
                <span className="metric-label">Earners</span>
                {loading ? (
                  <div className="mt-1 font-display text-metric-sm"><ValuePlaceholder sample="000" /></div>
                ) : (
                  <Metric value={earners} size="metric-sm" className="mt-1" />
                )}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-body-sm text-ink-2">Average balance per earner</span>
              <span className="text-body-sm font-semibold text-ink tabular">
                {loading ? <ValuePlaceholder sample="0,000" /> : `${avgCoins.toLocaleString('en-IN')} coins`}
              </span>
            </div>
          </Panel>

          <Panel title="Settlement Queue" sub="Approved and pending payouts awaiting transfer">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <span className="metric-label">Pending value</span>
                <div className="mt-1">
                  {loading
                    ? <span className="font-display text-metric"><ValuePlaceholder sample="₹00,000" /></span>
                    : <RupeeMetric paisa={pending} />}
                </div>
              </div>
              <div className="space-y-3">
                <Row label="Already settled" value={loading ? null : formatRupees(paidOut)} />
                <Row label="Still owed" value={loading ? null : formatRupees(pending)} />
                <Row
                  label="Liability vs revenue"
                  value={loading ? null : `${liabilityPct}%`}
                />
              </div>
            </div>
          </Panel>
        </Stagger>
      </div>
    </PageContainer>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-hairline pt-2.5">
      <span className="min-w-0 truncate text-body-sm text-ink-2">{label}</span>
      <span className="shrink-0 text-body-sm font-semibold text-ink tabular">
        {value ?? <ValuePlaceholder sample="₹00,000" />}
      </span>
    </div>
  )
}
