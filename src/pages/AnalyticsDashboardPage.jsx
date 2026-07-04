import { PageContainer } from '../components/layout/PageContainer';
import { SectionTitle } from '../components/layout/SectionTitle';
import { StatCard } from '../components/ui/StatCard';
import { EngagementCard } from '../components/ui/EngagementCard';
import { DemographicCard } from '../components/ui/DemographicCard';
import { FeatureCard } from '../components/ui/FeatureCard';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';
import { formatRupees } from '../lib/utils';

async function fetchAnalytics() {
  const zero = { count: 0, data: [] }
  const t = (ms) => new Promise(r => setTimeout(() => r(zero), ms))
  const safeQuery = (q) => Promise.race([
    q.then(r => r).catch(() => zero),
    t(5000),
  ])

  const [r0, r1, r2, r3, r4, r5, r6, r7] = await Promise.all([
    safeQuery(supabase.from('users').select('*', { count: 'exact', head: true })),
    safeQuery(supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'male')),
    safeQuery(supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'female')),
    safeQuery(supabase.from('payments').select('amount_paisa').eq('status', 'captured')),
    safeQuery(supabase.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'processing'])),
    safeQuery(supabase.from('chat_sessions').select('*', { count: 'exact', head: true })),
    safeQuery(supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed')),
    safeQuery(supabase.from('chat_messages').select('*', { count: 'exact', head: true })),
  ])

  const payments = r3.data || []
  const pendingPayouts = r4.data || []

  return {
    totalUsers: r0.count ?? 0,
    maleUsers: r1.count ?? 0,
    femaleUsers: r2.count ?? 0,
    totalRevenuePaisa: payments.reduce((s, p) => s + (p.amount_paisa || 0), 0),
    pendingPayoutsPaisa: pendingPayouts.reduce((s, p) => s + (p.payout_amount_paisa || 0), 0),
    totalChats: r5.count ?? 0,
    completedChats: r6.count ?? 0,
    totalMessages: r7.count ?? 0,
  }
}

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f8f6f1 0%, #ede9e0 40%, #f8f6f1 80%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.8s infinite linear',
}

function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-outline-variant shadow-card ${className}`}
      style={shimmerStyle}
    />
  )
}

function PageSkeleton() {
  return (
    <PageContainer>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} className="h-40" />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SkeletonCard className="h-56 lg:col-span-8" />
          <div className="flex flex-col gap-4 lg:col-span-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} className="h-16" />)}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export function AnalyticsDashboardPage() {
  const { data, loading } = useAdminQuery(fetchAnalytics)

  if (loading) return <PageSkeleton />

  const d = data || {}

  const revenueStats = [
    {
      label: 'Coin Revenue',
      value: d.totalRevenuePaisa / 100,
      icon: 'payments',
      trend: null,
      trendDirection: 'up',
      accent: 'dark',
      progress: 75,
      isCurrency: true,
    },
    {
      label: 'Total Chats',
      value: d.totalChats,
      icon: 'forum',
      trend: null,
      trendDirection: 'up',
      accent: 'secondary',
      progress: d.totalChats > 0 ? Math.min(100, Math.round((d.completedChats / d.totalChats) * 100)) : 0,
      isCurrency: false,
    },
    {
      label: 'Pending Payouts',
      value: d.pendingPayoutsPaisa / 100,
      icon: 'hourglass_empty',
      trend: null,
      trendDirection: 'down',
      accent: 'tertiary',
      progress: 33,
      isCurrency: true,
    },
    {
      label: 'Total Messages',
      value: d.totalMessages,
      icon: 'chat_bubble',
      trend: null,
      trendDirection: 'up',
      accent: 'primary',
      progress: 66,
      isCurrency: false,
    },
  ]

  const demographics = [
    { icon: 'group', label: 'Total Users', value: String(d.totalUsers), accent: 'primary', total: d.totalUsers },
    { icon: 'male', label: 'Male Users', value: String(d.maleUsers), accent: 'secondary', total: d.totalUsers },
    { icon: 'female', label: 'Female Users', value: String(d.femaleUsers), accent: 'tertiary', total: d.totalUsers },
  ]

  const completionRate = d.totalChats > 0
    ? Math.round((d.completedChats / d.totalChats) * 100)
    : 0

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-6">
        {/* Stat cards row */}
        <section>
          <SectionTitle title="Revenue Velocity" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {revenueStats.map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={i * 0.08}>
                <StatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        {/* Engagement + Demographics bento row */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-8">
            <SectionTitle title="Engagement Pulse" />
            <AnimatedCardEntrance delay={0.35} className="flex flex-1 flex-col">
              <EngagementCard
                title="Chat Engagement"
                value={d.totalChats.toLocaleString('en-IN')}
                description="Active chat sessions initiated across the platform."
                metrics={[
                  { label: 'Completed Chats', value: d.completedChats.toLocaleString('en-IN'), progress: completionRate },
                  { label: 'Total Messages', value: d.totalMessages.toLocaleString('en-IN'), progress: Math.min(100, d.totalMessages) },
                  { label: 'Male Users', value: String(d.maleUsers), progress: d.totalUsers > 0 ? Math.round((d.maleUsers / d.totalUsers) * 100) : 0 },
                ]}
                footerAction="View Detailed Engagement"
              />
            </AnimatedCardEntrance>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <SectionTitle title="User Distribution" />
            <div className="flex flex-1 flex-col gap-3">
              {demographics.map((item, i) => (
                <AnimatedCardEntrance key={item.label} delay={0.45 + i * 0.08}>
                  <DemographicCard {...item} />
                </AnimatedCardEntrance>
              ))}
            </div>
          </div>
        </section>

        {/* Feature/summary card */}
        <section>
          <AnimatedCardEntrance delay={0.7}>
            <FeatureCard
              icon="bolt"
              title="Growth Forecast"
              description={`Currently ${d.totalUsers} users registered (${d.maleUsers} male, ${d.femaleUsers} female). Revenue: ${formatRupees(d.totalRevenuePaisa)} from coin purchases.`}
              actionLabel="Export Full Report"
            />
          </AnimatedCardEntrance>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  )
}
