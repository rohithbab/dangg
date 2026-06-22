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
  const [
    { count: totalUsers },
    { count: maleUsers },
    { count: femaleUsers },
    { data: payments },
    { data: pendingPayouts },
    { count: totalChats },
    { count: completedChats },
    { count: totalMessages },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'male'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'female'),
    supabase.from('payments').select('amount_paisa').eq('status', 'captured'),
    supabase.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'processing']),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
  ])

  const totalRevenuePaisa = (payments || []).reduce((s, p) => s + (p.amount_paisa || 0), 0)
  const pendingPayoutsPaisa = (pendingPayouts || []).reduce((s, p) => s + (p.payout_amount_paisa || 0), 0)

  return {
    totalUsers: totalUsers || 0,
    maleUsers: maleUsers || 0,
    femaleUsers: femaleUsers || 0,
    totalRevenuePaisa,
    pendingPayoutsPaisa,
    totalChats: totalChats || 0,
    completedChats: completedChats || 0,
    totalMessages: totalMessages || 0,
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
    },
    {
      label: 'Total Chats',
      value: d.totalChats,
      icon: 'forum',
      trend: null,
      trendDirection: 'up',
      accent: 'secondary',
      progress: d.totalChats > 0 ? Math.min(100, Math.round((d.completedChats / d.totalChats) * 100)) : 0,
    },
    {
      label: 'Pending Payouts',
      value: d.pendingPayoutsPaisa / 100,
      icon: 'hourglass_empty',
      trend: null,
      trendDirection: 'down',
      accent: 'tertiary',
      progress: 33,
    },
    {
      label: 'Total Messages',
      value: d.totalMessages,
      icon: 'chat_bubble',
      trend: null,
      trendDirection: 'up',
      accent: 'primary',
      progress: 66,
    },
  ]

  const demographics = [
    { icon: 'group', label: 'Total Users', value: String(d.totalUsers), accent: 'primary' },
    { icon: 'male', label: 'Male Users', value: String(d.maleUsers), accent: 'secondary' },
    { icon: 'female', label: 'Female Users', value: String(d.femaleUsers), accent: 'tertiary' },
  ]

  const completionRate = d.totalChats > 0
    ? Math.round((d.completedChats / d.totalChats) * 100)
    : 0

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <section>
          <SectionTitle title="Revenue Velocity" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {revenueStats.map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={i * 0.1}>
                <StatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-8">
            <SectionTitle title="Engagement Pulse" />
            <AnimatedCardEntrance delay={0.4} className="flex flex-1 flex-col">
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
            <div className="flex flex-1 flex-col justify-between gap-4">
              {demographics.map((item, i) => (
                <AnimatedCardEntrance key={item.label} delay={0.5 + i * 0.1} className="flex-1">
                  <DemographicCard {...item} />
                </AnimatedCardEntrance>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <AnimatedCardEntrance delay={0.8}>
              <FeatureCard
                icon="bolt"
                title="Growth Forecast"
                description={`Currently ${d.totalUsers} users registered (${d.maleUsers} male, ${d.femaleUsers} female). Revenue: ${formatRupees(d.totalRevenuePaisa)} from coin purchases.`}
                actionLabel="Export Full Report"
              />
            </AnimatedCardEntrance>
          </div>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  )
}
