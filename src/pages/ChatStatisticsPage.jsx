import { PageContainer, PageHeader } from '../components/layout';
import { ChatStatCard } from '../components/ui/ChatStatCard';
import { EngagementMapCard } from '../components/ui/EngagementMapCard';
import { OperatorPulseCard } from '../components/ui/OperatorPulseCard';
import { AnimatedStaggerGroup, AnimatedCardEntrance } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';

async function fetchChatStats() {
  const [
    { count: totalRequests },
    { count: accepted },
    { count: declined },
    { count: cancelled },
    { count: expired },
    { count: activeSessions },
    { count: completedSessions },
    { count: totalMessages },
    { data: durations },
  ] = await Promise.all([
    // Total intent: every request ever sent
    supabase.from('chat_requests').select('*', { count: 'exact', head: true }),
    supabase.from('chat_requests').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('chat_requests').select('*', { count: 'exact', head: true }).eq('status', 'declined'),
    supabase.from('chat_requests').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('chat_requests').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'ended'),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
    supabase.from('chat_sessions').select('started_at, ended_at').eq('status', 'ended').not('ended_at', 'is', null),
  ])

  const totalDurationMs = (durations || []).reduce((sum, s) => {
    if (!s.started_at || !s.ended_at) return sum
    return sum + (new Date(s.ended_at) - new Date(s.started_at))
  }, 0)

  const totalDurationMin = Math.round(totalDurationMs / 60000)
  const avgDurationSec = (durations || []).length > 0
    ? Math.round(totalDurationMs / (durations.length * 1000))
    : 0

  const totalHours = Math.floor(totalDurationMin / 60)
  const remainingMin = totalDurationMin % 60
  const totalDurationLabel = totalDurationMin > 0 ? `${totalHours}h ${remainingMin}m` : '0m'

  const avgMin = Math.floor(avgDurationSec / 60)
  const avgSec = avgDurationSec % 60
  const avgDurationLabel = avgDurationSec > 0 ? `${avgMin}m ${avgSec}s` : '0m'

  const totalReq = totalRequests || 0
  const acceptedCount = accepted || 0
  const declinedCount = declined || 0
  const cancelledCount = cancelled || 0
  const expiredCount = expired || 0
  const activeCount = activeSessions || 0
  const completedCount = completedSessions || 0

  // Acceptance rate: % of all sent requests that were accepted
  const acceptanceRate = totalReq > 0 ? Math.round((acceptedCount / totalReq) * 100) : 0
  // Completion rate: % of accepted sessions that ended (vs still active)
  const completionRate = acceptedCount > 0 ? Math.round((completedCount / acceptedCount) * 100) : 0
  // Drop-off: requests that never became sessions
  const dropOff = declinedCount + cancelledCount + expiredCount

  return {
    totalRequests: totalReq,
    accepted: acceptedCount,
    declined: declinedCount,
    cancelled: cancelledCount,
    expired: expiredCount,
    activeSessions: activeCount,
    completedSessions: completedCount,
    totalMessages: totalMessages || 0,
    totalDurationLabel,
    avgDurationLabel,
    acceptanceRate,
    completionRate,
    dropOff,
  }
}

export function ChatStatisticsPage() {
  const { data, loading } = useAdminQuery(fetchChatStats)

  const d = data || {}

  const chatStats = [
    {
      label: 'Total Requests Sent',
      value: loading ? '…' : d.totalRequests?.toLocaleString('en-IN') ?? '0',
      icon: 'send',
      iconFill: true,
      accent: 'primary',
      badge: null,
      badgeVariant: 'neutral',
      footer: { type: 'text', text: 'All requests sent by males' },
    },
    {
      label: 'Acceptance Rate',
      value: loading ? '…' : `${d.acceptanceRate ?? 0}%`,
      icon: 'thumb_up',
      accent: 'secondary',
      badge: loading ? null : `${d.accepted?.toLocaleString('en-IN') ?? 0} accepted`,
      badgeVariant: 'trend-up',
      footer: { type: 'progressLabeled', percent: d.acceptanceRate || 0, label: `${d.acceptanceRate || 0}% females responded yes`, color: 'secondary' },
    },
    {
      label: 'Completed Sessions',
      value: loading ? '…' : d.completedSessions?.toLocaleString('en-IN') ?? '0',
      icon: 'task_alt',
      accent: 'secondary',
      badge: loading ? null : `${d.completionRate ?? 0}% of accepted`,
      badgeVariant: 'trend-up',
      footer: { type: 'progressLabeled', percent: d.completionRate || 0, label: `${d.completionRate || 0}% completion`, color: 'secondary' },
    },
    {
      label: 'Active Now',
      value: loading ? '…' : d.activeSessions?.toLocaleString('en-IN') ?? '0',
      icon: 'record_voice_over',
      accent: 'primary',
      badge: 'Live',
      badgeVariant: 'trend-up',
      footer: { type: 'text', text: 'Sessions currently in progress' },
    },
    {
      label: 'Drop-offs (Declined + Cancelled + Expired)',
      value: loading ? '…' : d.dropOff?.toLocaleString('en-IN') ?? '0',
      icon: 'cancel',
      accent: 'error',
      badge: loading ? null : d.totalRequests ? `${Math.round(((d.dropOff || 0) / d.totalRequests) * 100)}% of requests` : null,
      badgeVariant: 'trend-down',
      footer: { type: 'text', text: 'Requests that never became sessions' },
    },
    {
      label: 'Total Messages',
      value: loading ? '…' : d.totalMessages?.toLocaleString('en-IN') ?? '0',
      icon: 'forum',
      accent: 'secondary',
      badge: null,
      badgeVariant: 'neutral',
      footer: { type: 'text', text: 'Across all completed sessions' },
    },
    {
      label: 'Average Chat Duration',
      value: loading ? '…' : d.avgDurationLabel || '0m',
      icon: 'avg_time',
      accent: 'primary',
      badge: null,
      badgeVariant: 'neutral',
      footer: { type: 'text', text: 'Per completed session' },
    },
    {
      label: 'Total Chat Time',
      value: loading ? '…' : d.totalDurationLabel || '0m',
      icon: 'schedule',
      accent: 'tertiary',
      badge: 'Lifetime',
      badgeVariant: 'neutral',
      footer: { type: 'segments', segments: [true, true, true, false, false] },
    },
  ]

  const operatorItems = [
    { status: 'online', label: `${d.declined || 0} Declined by female` },
    { status: 'break', label: `${d.cancelled || 0} Cancelled by male` },
    { status: 'offline', label: `${d.expired || 0} Expired (no response)` },
  ]

  return (
    <PageContainer>
      <PageHeader description="Request funnel, session outcomes, and engagement depth." />
      <AnimatedStaggerGroup className="space-y-8">
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {chatStats.slice(0, 4).map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={i * 0.05}>
                <ChatStatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {chatStats.slice(4).map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={0.2 + i * 0.05}>
                <ChatStatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnimatedCardEntrance delay={0.5} className="lg:col-span-2">
            <EngagementMapCard />
          </AnimatedCardEntrance>
          <AnimatedCardEntrance delay={0.6}>
            <OperatorPulseCard items={operatorItems} />
          </AnimatedCardEntrance>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  )
}
