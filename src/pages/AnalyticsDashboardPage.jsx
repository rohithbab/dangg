import { PageContainer } from '../components/layout/PageContainer';
import { SectionTitle } from '../components/layout/SectionTitle';
import { StatCard } from '../components/ui/StatCard';
import { EngagementCard } from '../components/ui/EngagementCard';
import { DemographicCard } from '../components/ui/DemographicCard';
import { FeatureCard } from '../components/ui/FeatureCard';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';

const REVENUE_STATS = [
  {
    label: 'Coin Revenue',
    value: 12450,
    icon: 'payments',
    trend: '+12%',
    trendDirection: 'up',
    accent: 'primary',
    progress: 75,
  },
  {
    label: 'Net Profit',
    value: 8200,
    icon: 'trending_up',
    trend: '+5.4%',
    trendDirection: 'up',
    accent: 'secondary',
    progress: 50,
  },
  {
    label: 'Pending Payouts',
    value: 3100,
    icon: 'hourglass_empty',
    trend: '-2%',
    trendDirection: 'down',
    accent: 'tertiary',
    progress: 33,
  },
  {
    label: 'Actual Profit',
    value: 7850,
    icon: 'account_balance',
    trend: '+8%',
    trendDirection: 'up',
    accent: 'primary',
    progress: 66,
  },
];

const DEMOGRAPHICS = [
  { icon: 'group', label: 'Total Users', value: '850', accent: 'primary' },
  { icon: 'male', label: 'Male Users', value: '450', accent: 'secondary' },
  { icon: 'female', label: 'Female Users', value: '400', accent: 'tertiary' },
];

export function AnalyticsDashboardPage() {
  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <section>
          <SectionTitle title="Revenue Velocity" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {REVENUE_STATS.map((stat, i) => (
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
                title="Weekly User Engagement"
                value="24.8K"
                description="Active interactions across all modules including chat, voice, and profile browsing."
                metrics={[
                  { label: 'Chat Sessions', value: '12.4K', progress: 85 },
                  { label: 'Voice Calls', value: '4.2K', progress: 45 },
                  { label: 'Profile Views', value: '8.2K', progress: 65 },
                ]}
                footerAction="View Detailed Engagement"
              />
            </AnimatedCardEntrance>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <SectionTitle title="User Distribution" />
            <div className="flex flex-1 flex-col justify-between gap-4">
              {DEMOGRAPHICS.map((item, i) => (
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
                description="Our predictive models suggest a 24% increase in user acquisition by the end of Q3 based on current organic trends."
                actionLabel="Export Full Report"
              />
            </AnimatedCardEntrance>
          </div>
        </section>
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
