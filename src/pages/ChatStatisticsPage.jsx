import { PageContainer, PageHeader } from '../components/layout';
import { ChatStatCard } from '../components/ui/ChatStatCard';
import { EngagementMapCard } from '../components/ui/EngagementMapCard';
import { OperatorPulseCard } from '../components/ui/OperatorPulseCard';
import { AnimatedStaggerGroup, AnimatedCardEntrance } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';

async function fetchChatStats() {
  const [
    { count: total },
    { count: completed },
    { count: rejected },
    { count: totalMessages },
    { data: durations },
  ] = await Promise.all([
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).in('status', ['rejected', 'cancelled']),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
    supabase.from('chat_sessions').select('started_at, ended_at').eq('status', 'completed').not('ended_at', 'is', null),
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

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total: total || 0,
    completed: completed || 0,
    rejected: rejected || 0,
    totalMessages: totalMessages || 0,
    totalDurationLabel,
    avgDurationLabel,
    completionRate,
  }
}

export function ChatStatisticsPage() {
  const { data, loading } = useAdminQuery(fetchChatStats)

  const d = data || {}

  const chatStats = [
    {
      label: 'Total Chat Initiated',
      value: loading ? '…' : d.total?.toLocaleString('en-IN') ?? '0',
      icon: 'chat_bubble',
      iconFill: true,
      accent: 'primary',
      badge: null,
      badgeVariant: 'neutral',
      footer: { type: 'progress', percent: 75, color: 'primary' },
    },
    {
      label: 'Completed Chat Count',
      value: loading ? '…' : d.completed?.toLocaleString('en-IN') ?? '0',
      icon: 'task_alt',
      accent: 'secondary',
      badge: d.completionRate ? `${d.completionRate}%` : null,
      badgeVariant: 'trend-up',
      footer: { type: 'progressLabeled', percent: d.completionRate || 0, label: `${d.completionRate || 0}%`, color: 'secondary' },
    },
    {
      label: 'Rejected / Cancelled',
      value: loading ? '…' : d.rejected?.toLocaleString('en-IN') ?? '0',
      icon: 'cancel',
      accent: 'error',
      badge: null,
      badgeVariant: 'error',
      footer: { type: 'text', text: 'Dropped by system or timeout' },
    },
    {
      label: 'Total Chat Duration',
      value: loading ? '…' : d.totalDurationLabel || '0m',
      icon: 'schedule',
      accent: 'tertiary',
      badge: 'Lifetime',
      badgeVariant: 'neutral',
      footer: { type: 'segments', segments: [true, true, true, false, false] },
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
      label: 'Total Messages',
      value: loading ? '…' : d.totalMessages?.toLocaleString('en-IN') ?? '0',
      icon: 'forum',
      accent: 'secondary',
      badge: null,
      badgeVariant: 'neutral',
      footer: { type: 'text', text: 'Across all chat sessions' },
    },
  ]

  const operatorItems = [
    { status: 'online', label: `${d.completed || 0} Completed Chats` },
    { status: 'break', label: `${d.rejected || 0} Rejected / Cancelled` },
    { status: 'offline', label: `${(d.total || 0) - (d.completed || 0) - (d.rejected || 0)} In Progress` },
  ]

  return (
    <PageContainer>
      <PageHeader description="Real-time engagement and operational efficiency metrics." />
      <AnimatedStaggerGroup className="space-y-8">
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chatStats.map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={i * 0.05}>
                <ChatStatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnimatedCardEntrance delay={0.4} className="lg:col-span-2">
            <EngagementMapCard />
          </AnimatedCardEntrance>
          <AnimatedCardEntrance delay={0.5}>
            <OperatorPulseCard items={operatorItems} />
          </AnimatedCardEntrance>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  )
}
