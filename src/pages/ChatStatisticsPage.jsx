import { PageContainer, PageHeader } from '../components/layout';
import { ChatStatCard } from '../components/ui/ChatStatCard';
import { EngagementMapCard } from '../components/ui/EngagementMapCard';
import { OperatorPulseCard } from '../components/ui/OperatorPulseCard';
import { AnimatedStaggerGroup, AnimatedCardEntrance } from '../components/animation';

const CHAT_STATS = [
  {
    label: 'Total Chat Initiated',
    value: '2,842',
    icon: 'chat_bubble',
    iconFill: true,
    accent: 'primary',
    badge: '+12.4%',
    badgeVariant: 'trend-up',
    footer: { type: 'progress', percent: 75, color: 'primary' },
  },
  {
    label: 'Completed Chat Count',
    value: '2,610',
    icon: 'task_alt',
    accent: 'secondary',
    badge: '+8.2%',
    badgeVariant: 'trend-up',
    footer: { type: 'progressLabeled', percent: 91.8, label: '91.8%', color: 'secondary' },
  },
  {
    label: 'Rejected Chats',
    value: '42',
    icon: 'cancel',
    accent: 'error',
    badge: '-2.1%',
    badgeVariant: 'error',
    footer: { type: 'text', text: 'Dropped by system or timeout' },
  },
  {
    label: 'Total Chat Duration',
    value: '452h 12m',
    icon: 'schedule',
    accent: 'tertiary',
    badge: 'Lifetime',
    badgeVariant: 'neutral',
    footer: {
      type: 'segments',
      segments: [true, true, true, false, false],
    },
  },
  {
    label: 'Average Chat Duration',
    value: '8m 34s',
    icon: 'avg_time',
    accent: 'primary',
    badge: '-45s',
    badgeVariant: 'trend-up',
    footer: { type: 'text', text: 'Optimized from 9m 19s last week' },
  },
  {
    label: 'Peak Activity Hour',
    value: '14:00 - 15:00',
    icon: 'trending_up',
    accent: 'secondary',
    badge: 'Daily',
    badgeVariant: 'neutral',
    footer: {
      type: 'pills',
      pills: [
        { label: 'Mon: 14h', active: false },
        { label: 'Tue: 15h', active: true },
        { label: 'Wed: 11h', active: false },
      ],
    },
  },
];

const OPERATOR_ITEMS = [
  { status: 'online', label: '42 Agents Online' },
  { status: 'break', label: '12 Agents on Break' },
  { status: 'offline', label: '8 Agents Offline' },
];

export function ChatStatisticsPage() {
  return (
    <PageContainer>
      <PageHeader description="Real-time engagement and operational efficiency metrics." />

      <AnimatedStaggerGroup className="space-y-8">
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CHAT_STATS.map((stat, i) => (
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
            <OperatorPulseCard items={OPERATOR_ITEMS} />
          </AnimatedCardEntrance>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
