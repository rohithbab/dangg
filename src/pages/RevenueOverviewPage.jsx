import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeader } from '../components/layout/SectionHeader';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { RevenueMetricCard } from '../components/ui/RevenueMetricCard';
import { PendingPayoutsCard } from '../components/ui/PendingPayoutsCard';
import { WalletBalanceCard } from '../components/ui/WalletBalanceCard';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatRupees } from '../lib/utils';

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
    supabase.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'processing', 'approved']),
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

function PageSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-surface-container rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="h-48 bg-surface-container rounded-3xl" />
          <div className="h-48 bg-surface-container rounded-3xl" />
        </div>
      </div>
    </PageContainer>
  )
}

export function RevenueOverviewPage() {
  const { data, loading } = useAdminQuery(fetchRevenue)

  if (loading) return <PageSkeleton />

  const d = data || {}

  const revenueMetrics = [
    {
      label: 'Total Revenue',
      value: d.totalRevenuePaisa || 0,
      icon: 'monetization_on',
      accent: 'primary',
      badge: <span className="badge-neutral">Coin purchases</span>,
    },
    {
      label: 'Completed Payouts',
      value: d.completedPayoutsPaisa || 0,
      icon: 'account_balance',
      accent: 'secondary',
      badge: <span className="badge-neutral">Verified</span>,
    },
    {
      label: 'Actual Profit',
      value: Math.max(0, d.actualProfitPaisa || 0),
      icon: 'insights',
      accent: 'tertiary',
      badge: <span className="badge-accent">Net</span>,
    },
  ]

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <section>
          <SectionHeader title="Revenue Insights" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {revenueMetrics.map((metric, i) => (
              <AnimatedCardEntrance key={metric.label} delay={i * 0.1}>
                <RevenueMetricCard {...metric} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <AnimatedCardEntrance delay={0.4}>
            <WalletBalanceCard
              amount={d.totalFemaleCoins || 0}
              avatarUrls={[]}
              avatarCount={d.femaleCount || 0}
            />
          </AnimatedCardEntrance>
          <AnimatedCardEntrance delay={0.6}>
            <PendingPayoutsCard count={d.pendingPayoutsPaisa ? Math.round(d.pendingPayoutsPaisa / 100) : 0} />
          </AnimatedCardEntrance>
        </div>
      </AnimatedStaggerGroup>
    </PageContainer>
  )
}
