import { PageContainer } from '../components/layout';
import { KpiCard } from '../components/ui/KpiCard';
import { Stagger, Reveal } from '../components/motion/primitives';
import { Metric } from '../components/motion/Metric';
import { ValuePlaceholder, LoadingRegion, LoadingBar } from '../components/motion/Placeholder';
import { FunnelBars, RadialProgress } from '../components/viz/charts';
import { CAT } from '../components/viz/palette';
import { PulseDot } from '../components/viz/micro';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────────────────────────────────
   DATA LAYER — UNCHANGED.
   ───────────────────────────────────────────────────────────────────────── */
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

export function ChatStatisticsPage() {
  const { data, loading } = useAdminQuery(fetchChatStats)
  const d = data || {}

  const totalReq = d.totalRequests ?? 0
  const accepted = d.accepted ?? 0
  const declined = d.declined ?? 0
  const cancelled = d.cancelled ?? 0
  const expired = d.expired ?? 0
  const active = d.activeSessions ?? 0
  const completed = d.completedSessions ?? 0
  const messages = d.totalMessages ?? 0
  const dropOff = d.dropOff ?? 0
  const acceptanceRate = d.acceptanceRate ?? 0
  const completionRate = d.completionRate ?? 0

  const dropPct = totalReq > 0 ? Math.round((dropOff / totalReq) * 100) : 0
  const msgsPerSession = completed > 0 ? Math.round(messages / completed) : 0

  /* A REAL funnel: every stage is a strict subset of the one above it, so
     percent-of-total is meaningful here (unlike the analytics activity ladder). */
  const funnel = [
    { label: 'Requests sent', value: totalReq, pct: 100, color: CAT[1] },
    { label: 'Accepted', value: accepted, pct: acceptanceRate, color: CAT[2] },
    { label: 'Sessions ended', value: completed, pct: totalReq ? Math.round((completed / totalReq) * 100) : 0, color: CAT[0] },
  ]

  /* Where requests die. Same denominator (total requests), so these percentages
     are comparable to each other and to the funnel above. */
  const dropReasons = [
    { label: 'Declined by female', value: declined, pct: totalReq ? Math.round((declined / totalReq) * 100) : 0, color: CAT[0] },
    { label: 'Cancelled by male', value: cancelled, pct: totalReq ? Math.round((cancelled / totalReq) * 100) : 0, color: CAT[3] },
    { label: 'Expired (no response)', value: expired, pct: totalReq ? Math.round((expired / totalReq) * 100) : 0, color: CAT[4] },
  ]

  return (
    <PageContainer>
      <div className="space-y-4 above-grain sm:space-y-5">
        <LoadingRegion loading={loading} label="Loading chat statistics" />
        <LoadingBar active={loading} />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink">Chat Statistics</h1>
              <p className="mt-1 flex items-center gap-2 text-body text-ink-2">
                <PulseDot />
                Request funnel, session outcomes and engagement depth
              </p>
            </div>
            {!loading && active > 0 && (
              <span className="pill pill-good">
                <PulseDot />
                {active} live now
              </span>
            )}
          </div>
        </Reveal>

        {/* KPI row */}
        <Stagger className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 xl:grid-cols-4" gap={0.07}>
          <Reveal className="h-full">
            <KpiCard
              label="Requests Sent"
              value={totalReq}
              loading={loading}
              caption="funnel entry point"
              viz="spark"
              accent
              vizProps={{ points: [6, 10, 9, 15, 13, 20, 19, 25], color: '#FFFFFF', width: 84, height: 32 }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Acceptance Rate"
              value={acceptanceRate}
              suffix="%"
              loading={loading}
              caption={loading ? 'of all requests' : `${accepted.toLocaleString('en-IN')} accepted`}
              viz="gauge"
              vizProps={{ value: acceptanceRate, label: `${acceptanceRate}%` }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Active Now"
              value={active}
              loading={loading}
              caption="sessions in progress"
              viz="dots"
              live
              vizProps={{ filled: Math.min(40, active), total: 40, cols: 8, color: 'bg-cat-3' }}
            />
          </Reveal>
          <Reveal className="h-full">
            <KpiCard
              label="Drop-offs"
              value={dropOff}
              loading={loading}
              caption={loading ? 'never became sessions' : `${dropPct}% of requests`}
              delta={loading ? null : -dropPct}
              deltaInvert
              viz="bars"
              vizProps={{ values: [dropPct, 100 - dropPct], colors: ['bg-cat-1', 'bg-cat-3'] }}
            />
          </Reveal>
        </Stagger>

        {/* Funnel + drop-off reasons */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12" gap={0.09} delay={0.15}>
          <Panel
            span="lg:col-span-7"
            title="Request Funnel"
            sub="Each stage as a share of all requests sent"
            action={<span className="pill pill-neutral">all time</span>}
          >
            <FunnelBars steps={funnel} loading={loading} />

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-hairline pt-4 xs:grid-cols-3">
              <Stat label="Acceptance" value={loading ? null : `${acceptanceRate}%`} />
              <Stat label="Completion" value={loading ? null : `${completionRate}%`} />
              <Stat label="Msgs / session" value={loading ? null : msgsPerSession.toLocaleString('en-IN')} />
            </div>
          </Panel>

          <Panel
            span="lg:col-span-5"
            title="Where Requests Die"
            sub="Break-down of the drop-off"
          >
            <div className="flex h-full flex-col justify-between gap-5">
              <FunnelBars steps={dropReasons} loading={loading} />
              <div className="well flex items-center justify-between gap-4 p-4">
                <div>
                  <span className="metric-label">Total lost</span>
                  <div className="mt-1 font-display text-metric-sm text-ink tabular">
                    {loading ? <ValuePlaceholder sample="0,000" /> : dropOff.toLocaleString('en-IN')}
                  </div>
                </div>
                <RadialProgress
                  value={dropPct}
                  size={84}
                  loading={loading}
                  /* Loss is never "good" — this dial goes amber→red as it
                     rises and never green, so the colour cannot read as praise
                     for a third of requests dying. */
                  color={dropPct > 50 ? '#B3341A' : '#B8891B'}
                  sublabel="lost"
                />
              </div>
            </div>
          </Panel>
        </Stagger>

        {/* Duration + volume */}
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3" gap={0.09} delay={0.25}>
          <Panel title="Session Length" sub="How long conversations run">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <span className="metric-label">Average duration</span>
                <div className="mt-1 font-display text-metric text-ink tabular">
                  {loading ? <ValuePlaceholder sample="0m 00s" /> : (d.avgDurationLabel || '0m')}
                </div>
              </div>
              <div className="space-y-3">
                <Row label="Total chat time" value={loading ? null : (d.totalDurationLabel || '0m')} />
                <Row label="Sessions ended" value={loading ? null : completed.toLocaleString('en-IN')} />
                <Row label="Active now" value={loading ? null : active.toLocaleString('en-IN')} />
              </div>
            </div>
          </Panel>

          <Panel title="Completion" sub="Accepted sessions that reached an end">
            <div className="flex h-full flex-col items-center justify-center gap-4 py-2">
              <RadialProgress
                value={completionRate}
                loading={loading}
                sublabel="completed"
                color={completionRate < 40 ? '#B3341A' : completionRate < 70 ? '#B8891B' : '#3E9B72'}
              />
              <p className="text-balance text-center text-body-sm text-ink-2">
                {loading
                  ? 'Calculating completion…'
                  : `${completed.toLocaleString('en-IN')} of ${accepted.toLocaleString('en-IN')} accepted sessions ended`}
              </p>
            </div>
          </Panel>

          <Panel title="Message Volume" sub="Depth of conversation">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <span className="metric-label">Total messages</span>
                {loading ? (
                  <div className="mt-1 font-display text-metric"><ValuePlaceholder sample="00,000" /></div>
                ) : (
                  <Metric value={messages} className="mt-1" />
                )}
              </div>
              <div className="space-y-3">
                <Row label="Per ended session" value={loading ? null : msgsPerSession.toLocaleString('en-IN')} />
                <Row label="Accepted requests" value={loading ? null : accepted.toLocaleString('en-IN')} />
                <Row label="Declined requests" value={loading ? null : declined.toLocaleString('en-IN')} />
              </div>
            </div>
          </Panel>
        </Stagger>
      </div>
    </PageContainer>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-display text-metric-sm text-ink tabular">
        {value ?? <ValuePlaceholder sample="00" />}
      </div>
      <span className="mt-1 block text-label-xs uppercase text-ink-3">{label}</span>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-hairline pt-2.5">
      <span className="min-w-0 truncate text-body-sm text-ink-2">{label}</span>
      <span className="shrink-0 text-body-sm font-semibold text-ink tabular">
        {value ?? <ValuePlaceholder sample="0,000" />}
      </span>
    </div>
  )
}
